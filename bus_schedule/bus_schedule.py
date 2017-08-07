import datetime
import json
import time
import pytz
import requests
import sys
import threading

from flask import Flask, request
app = Flask(__name__)

STOP_EASTBOUND = '280'
STOP_WESTBOUND = '67019'

LINE_212_EAST = '2124'
LINE_212_WEST = '2125'
LINE_554_WEST = '5545'
LINE_554_EAST = '5544'

STOPS = {
    STOP_EASTBOUND: {
        'lines': (LINE_212_EAST, LINE_554_EAST),
    },

    STOP_WESTBOUND: {
        'lines': (LINE_212_WEST, LINE_554_WEST),
    },
}

def cached(for_seconds):
    def decorator(func):
        lock = threading.RLock()
        cache = {}

        def wrapped(*args, **kwargs):
            with lock:
                key = (megahash(args), megahash(kwargs))
                cached = cache.get(key, {})
                value = cached.get('value')
                last_updated = cached.get('last_updated')
                expired = (last_updated is None or
                           (time.time() - last_updated) > for_seconds)
                if value is None or expired:
                    cached['value'] = func(*args, **kwargs)
                    cached['last_updated'] = time.time()
                    cache[key] = cached

                return cached['value']

            return cached
        return wrapped
    return decorator

def megahash(obj):
    if isinstance(obj, list) or isinstance(obj, tuple):
        return reduce(sum, map(megahash, obj), [0])
    elif isinstance(obj, dict):
        return reduce(sum, map(megahash, obj.iteritems()), 0)
    else:
        return hash(obj)

@app.route("/schedule")
def root():
    direction = request.args.get('dir', 'east')
    stop_id = STOP_WESTBOUND if direction == 'west' else STOP_EASTBOUND
    schedule = get_schedule(stop_id)
    json_schedule = json.dumps(schedule)
    callback = request.args.get('callback')
    if callback:
        return '%s(%s);' % (callback, json_schedule)
    else:
        return json_schedule

def get_schedule(stop_id):
    lines = STOPS[stop_id]['lines']
    stop_info = fetch_stop_info(stop_id)
    schedule = []
    for result in stop_info['result']:
        for stop_time_result in result['StopTimeResult']:
            for stop in stop_time_result['StopTimes']:
                line = str(stop['LineDirId'])
                if line in lines:
                    realtime = stop.get('RealTime', {})
                    valid = realtime.get('Valid') == 'Y'
                    reliable = realtime.get('Reliable') == 'Y'
                    if valid and reliable:
                        etime = realtime['Estimatedtime']
                    else:
                        etime = stop['ETime']

                    sorttime = get_sorttime(etime)
                    schedule.append((sorttime, etime, line[:3]))

    schedule.sort()

    return [
        {'etime': etime, 'line': line}
        for _, etime, line in schedule]

def get_sorttime(etime):
    h, m = map(int, etime[:-1].split(':'))
    apm = etime[-1]
    return (apm, h, m)

@cached(30)
def fetch_stop_info(stop_id):
    headers = {
        'Origin': 'http://tripplanner.kingcounty.gov',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Referer': 'http://tripplanner.kingcounty.gov/hiwire?.a=iRealTimeDisplay',
        'Connection': 'keep-alive',
    }

    d = datetime.datetime.now(pytz.timezone('US/Pacific'))
    from_time = d.hour * 3600 + d.minute * 60 - 60

    data = '{"version":"1.1","method":"GetBusTimes","params":{"LinesRequest":{"FromTime":%s,"StopId":%s,"Radius":0,"NumTimesPerLine":5,"NumStopTimes":20},"Appid":"Desktop","Client":"RMD"}}' % (
        from_time, stop_id)

    return requests.post(
        'http://tripplanner.kingcounty.gov/InfoWeb',
        headers=headers,
        data=data).json()


if __name__ == '__main__':
    stop_id = STOP_WESTBOUND if sys.argv[1] == 'west' else STOP_EASTBOUND
    print get_schedule(stop_id)
