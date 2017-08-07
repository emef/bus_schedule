pushd `dirname $0` > /dev/null
DEPLOYDIR=`pwd`
popd > /dev/null
SOCKETCONF=$DEPLOYDIR/bus_schedule.socket
SERVICECONF=$DEPLOYDIR/bus_schedule.service
NGINXCONF=$DEPLOYDIR/nginx.conf
APPDIR=`realpath $DEPLOYDIR/../`

deploy() {
  echo "deploying to $BUS_HOST"

  echo "uploading app code"
  rsync -az --exclude node_modules $APPDIR $BUS_HOST:
  ssh $BUS_HOST "sudo mkdir -p /opt/bus_schedule"
  ssh $BUS_HOST "sudo rm -rf /opt/bus_schedule/*"
  ssh $BUS_HOST "sudo mv bus_schedule/* /opt/bus_schedule"
  ssh $BUS_HOST "rm -rf ./bus_schedule"
  ssh $BUS_HOST "sudo chown -R bus_schedule /opt/bus_schedule"

  echo "setting up virtualenv"
  ssh $BUS_HOST "sudo mkdir -p /opt/virtualenv"
  ssh $BUS_HOST "sudo virtualenv /opt/virtualenv/bus_schedule" &>/dev/null
  ssh $BUS_HOST "sudo /opt/virtualenv/bus_schedule/bin/pip install -r /opt/bus_schedule/requirements.txt" &>/dev/null

  echo "stopping server for deploy"
  ssh $BUS_HOST "sudo systemctl stop bus_schedule.socket" &>/dev/null
  ssh $BUS_HOST "sudo systemctl stop bus_schedule.service" &>/dev/null

  echo "installing systemd socket"
  scp $SOCKETCONF $BUS_HOST: &>/dev/null
  ssh $DJV_HOST "sudo mv bus_schedule.socket /lib/systemd/system/"
  ssh $BUS_HOST "sudo chmod 755 /lib/systemd/system/bus_schedule.socket"
  ssh $BUS_HOST "sudo systemctl enable bus_schedule.socket"

  echo "installing systemd service"
  scp $SERVICECONF $BUS_HOST: &>/dev/null
  ssh $BUS_HOST "sudo mv bus_schedule.service /lib/systemd/system/"
  ssh $BUS_HOST "sudo chmod 755 /lib/systemd/system/bus_schedule.service"
  ssh $BUS_HOST "sudo systemctl enable bus_schedule.service"

  echo "starting systemd socket and service"
  ssh $BUS_HOST "sudo systemctl daemon-reload"
  ssh $BUS_HOST "sudo systemctl start bus_schedule.socket"
  ssh $BUS_HOST "sudo systemctl start bus_schedule.service"

  echo "installing nginx config and restarting it"
  scp $NGINXCONF $BUS_HOST: &>/dev/null
  ssh $BUS_HOST "sudo mv nginx.conf /etc/nginx/sites-available/bus_schedule"
  ssh $BUS_HOST "sudo ln -s /etc/nginx/sites-available/bus_schedule /etc/nginx/sites-enabled/" &>/dev/null
  ssh $BUS_HOST "sudo service nginx restart"
}

deploy
