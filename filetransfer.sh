#!/bin/bash
# Source file/folder path
source_file="/var/www/backend/BACKEND/App/Cron/cron.js"
remort_path_file="/var/www/backend/BACKEND/App/Cron"

source_file1="/var/www/backend/BACKEND/request.js"
remort_path_file1="/var/www/backend/BACKEND/"

source_path="/var/www/backend/BACKEND"
source_path_bb="/var/www/backend/brokerbackend"
source_path_build="/var/www/newpenal.pandpinfotech.com/"
remort_path="/var/www/backend/"

  servers=(
'root@185.209.75.183'
'root@217.145.69.72'
'root@185.209.75.70'
'root@185.209.75.22'
'root@185.209.75.196'
'root@185.209.75.186'
'root@217.145.69.46'
'root@185.209.75.15'
'root@217.145.69.145'
'root@185.209.75.71'
'root@217.145.69.152'
'root@217.145.69.138'
'root@185.209.75.184'
  )  

# # Array to store remote paths for each server
  remotepath=(
'software.growingtech.in'
'trade.allianceaiinfotech.com'
'software.inspirealgoresearch.com'
'software.fincapex.com'
'software.one-algo.com'
'software.shinesofttrade.in'
'fincap.autolabels.in'
'software.researchfactory.in'
'software.celestialai.in'
'software.infraitsolution.com'
'software.moneyplatform.co.in'
'software.idealalgo.com'
'software.visioncodesoftware.com'
   )


passwords=(
'K0&j5Dgv&p70'
'4KV@8c2d!g6b'
'Vu0&i38nzC3&'
'4c3$^t9b8tSO'
'z2J6e5#e%4aM'
'vDc9a&N7f09$'
'E4qf6hl95&J$'
'58&&Y78rdJoq'
'0843z%Rv^Lhs'
'Y7w92Cnxl9&!'
'qq@4V$5s6r4A'
'Z@3&rz437kpP'
'w0Km33!gB#6s'

)

   


# Loop through each server and transfer the file/folder
for i in "${!servers[@]}"; do

    server="${servers[i]}"

    password="${passwords[i]}"

    remote_path1="/var/www/${remotepath[i]}/"

    # read -s -p "Enter the password for $server: " password

     echo "Transferring to $server"

   # echo "Running npm i on $server:/var/www/backend/BACKEND"

    # sshpass -p "$password" ssh "$server" "rm -rf /var/www/front"
    # sshpass -p "$password" ssh "$server" "rm -rf /var/www/html"
    # sshpass -p "$password" ssh "$server" "rm -rf /var/www/backend/BACKEND/sunya.js"
   #  sshpass -p "$password" ssh "$server" "rm -rf /root/.pm2/logs"
    # sshpass -p "$password" ssh "$server" "rm -rf $remote_path1/BACKUP"

    
    # Backend Code
 sshpass -p "$password" rsync -avz --exclude ".env" --exclude ".gitignore" --exclude "node_modules" --exclude "Logs" "$source_path" "$server:$remort_path"
   
   # Backend Code Only File
  # sshpass -p "$password" rsync -avz --exclude ".env" --exclude ".gitignore" --exclude "node_modules" --exclude "Logs" "$source_file" "$server:$remort_path_file"

  # sshpass -p "$password" rsync -avz --exclude ".env" --exclude ".gitignore" --exclude "node_modules" --exclude "Logs" "$source_file1" "$server:$remort_path_file1"

    # Execute npm i Backend
 sshpass -p "$password" ssh "$server" "cd /var/www/backend/BACKEND && npm i --force"

   # Broker Backend Code
   sshpass -p "$password" rsync -avz --exclude ".env" --exclude ".gitignore" --exclude "node_modules" --exclude "AllPanelTextFile" --exclude "Logs" "$source_path_bb" "$server:$remort_path"
    
    # Execute npm i Broker - Backend
  sshpass -p "$password" ssh "$server" "cd /var/www/backend/brokerbackend && npm i"

   # Build Code
  sshpass -p "$password" rsync -avz  "$source_path_build" "$server:$remote_path1"
    

   # mongodb restart command
   sshpass -p "$password" ssh "$server" "systemctl restart mongod"

  #  Reload broker server
  sshpass -p "$password" ssh "$server" "pm2 reload broker_server"

  #  # Reload app
  sshpass -p "$password" ssh "$server" "pm2 reload app"
    

   # Pm2 Update
  # sshpass -p "$password" ssh "$server" "pm2 update"
    # Remove the password from the variable after using it

    # unset password

done
