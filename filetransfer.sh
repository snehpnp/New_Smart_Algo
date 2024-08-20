#!/bin/bash
# Source file/folder path
source_path="/var/www/backend/BACKEND"
source_path_bb="/var/www/backend/brokerbackend"
source_path_build="/var/www/newpenal.pandpinfotech.com/"
remort_path="/var/www/backend/"

# # List of destination servers "root@172.105.43.81"
  servers=(
  # "root@185.209.75.10"
  # "root@185.209.75.31" 
  # "root@193.239.237.93" 
  # "root@193.239.237.178" 
  # "root@193.239.237.92" 
  # "root@185.209.75.61" 
  # "root@193.239.237.135" 
  # "root@193.239.237.137" 
  "root@185.209.75.2" 
  "root@185.209.75.5" 
  "root@185.209.75.8" 
  "root@185.209.75.9"
  "root@185.209.75.11" 
  "root@185.209.75.12" 
  "root@185.209.75.14" 
  "root@185.209.75.15" 
  "root@185.209.75.21" 
  "root@185.209.75.23" 
  "root@172.105.48.186" 
  "root@185.209.75.27" 
  "root@185.209.75.22" 
  "root@185.209.75.28" 
  "root@185.209.75.29" 
  "root@185.209.75.30" 
  "root@185.209.75.62" 
  "root@185.209.75.63" 
  "root@185.209.75.64" 
  "root@185.209.75.65" 
  "root@185.209.75.66" 
  "root@185.209.75.67" 
  "root@185.209.75.68" 
  "root@185.209.75.69" 
  "root@185.209.75.70"
  "root@185.209.75.180"
  "root@185.209.75.181"
  "root@185.209.75.182"
  "root@185.209.75.184"
  "root@185.209.75.185"
  "root@185.209.75.186"
  "root@185.209.75.187"
  "root@185.209.75.189"
  "root@185.209.75.251"
  "root@185.209.75.252"
  "root@185.209.75.254"
  "root@185.209.75.253" 
  "root@185.209.75.191"
  "root@185.209.75.192"
  "root@185.209.75.190"
  'root@185.209.75.193'
  'root@185.209.75.194'
  'root@185.209.75.195'
  'root@185.209.75.196'
  'root@185.209.75.197'
  'root@185.209.75.199'
  'root@193.239.237.33'
  'root@193.239.237.35'
  'root@193.239.237.114'
  'root@193.239.237.115'
  'root@193.239.237.44'
  'root@193.239.237.128'
  'root@185.209.75.87'
  'root@185.209.75.88'
  'root@185.209.75.89'
  'root@185.209.75.90'
  'root@185.209.75.183'
  'root@5.178.98.2'
  'root@5.178.98.3'
  'root@5.178.98.5'
  'root@5.178.98.6'
  'root@5.178.98.7'
  'root@5.178.98.8'
  'root@5.178.98.9'






  )  

# # Array to store remote paths for each server
  remotepath=(

  #  "software.corebizinfotech.com"
  #  "trade.codingpandit.com"
  #  "software.oneplanetitsolution.com" 
  #  "software.adonomist.com" 
  #  "software.algobullstradingsolutions.com" 
  #  "software.intelfintech.com" 
  #  "software.algokuber.com" 
  #  "software.finnshri.com" 
   "software.visioniq.in" 
   "software.believetechnology.in" 
   "software.realbottrading.com" 
   "software.growskyinfotech.com"  
   "software.inspirealgo.com" 
   "software.uniquetechnology.in" 
   "software.yourstechexpert.com" 
   "software.alphapulsepro.com" 
   "software.sumedhainn.com"
   "software.tradeonn.com" 
   "software.nationalalgo.com" 
   "software.vintyaitsolutions.com" 
   "software.growupalgo.com"  
   "software.robotexfintech.com"  
   "software.metaprogramming.in" 
   "software.fincodify.com" 
   "software.invicontechnology.com" 
   "software.axcellencetechnology.com" 
   "software.sstechnologiess.com" 
   "software.skwinvestmentadviser.com" 
   "software.satviktech.com" 
   "software.thinkaumatictechnology.com" 
   "trade.visionresearchandsolution.com" 
   "software.smartwavetechnology.in" 
   "software.codinghornet.in"
   "software.inteltrade360.com"
   "software.fintechit.in"
   "software.thrivinginfotech.com"
   "software.visioncodesoftware.com"
   "trade.brightextech.com"
   "software.shinesofttrade.in"
   "software.algoruns.com"
   "software.techoceantechnologies.in"
   "software.brillianttechit.com"
   "software.newtimetechnologies.com"
   "software.darixosolution.com"
   "software.magmamultitrade.com"
   "software.intravisor.com"
   "software.procodetechnology.com"
   "software.unitythesmartalgo.com"
  "software.smartstox.in"
  'software.visionmatictechnology.com/'
  'software.winwaysoftwares.com'
  'software.one-algo.com'
  'software.unityhubitsolution.com'
  'software.wealthcrafttechnology.com'
  'software.techelitesolution.in'
  'software.algosparks.in'
  'software.ssfintech.com'
  'software.rainfotech.com'
  'software.technofin.tech'
  'software.vittsurge.com'
  'software.growwayalgo.com'
  'software.evolgo.in'
  'software.growonntechnologies.com'
  'software.tradejockey.in'
  'software.growingtech.in'
  'software.shreedhasolutions.com'
  'software.inovateinfotech.com'
  'software.algobliss.com'
  'software.idealalgo.com'
  'software.apextechinnovative.com'
  'software.eaglesofttech.com'
  'software.algomoneybooster.com'





   )


# List of destination servers "root@172.105.43.81"
  # corebizinfotech diffrent frotend
  #  servers=("root@185.209.75.10") 
  #  remotepath=("software.corebizinfotech.com")



# Loop through each server and transfer the file/folder
for i in "${!servers[@]}"; do

    server="${servers[i]}"
    remote_path1="/var/www/${remotepath[i]}/"

     read -s -p "Enter the password for $server: " password

     echo "Transferring to $server"

    echo "Running npm i on $server:/var/www/backend/BACKEND"

    
    # Backend Code
    sshpass -p "$password" rsync -avz --exclude ".env" --exclude ".gitignore" --exclude "shakirTeting.js" --exclude "node_modules" --exclude "Logs" "$source_path" "$server:$remort_path"

    # Execute npm i Backend
    sshpass -p "$password" ssh "$server" "cd /var/www/backend/BACKEND && npm i --force"

   # Broker Backend Cod
    sshpass -p "$password" rsync -avz --exclude ".env" --exclude ".gitignore" --exclude "shakirTeting.js" --exclude "node_modules" --exclude "AllPanelTextFile" --exclude "Logs" "$source_path_bb" "$server:$remort_path"
    
    # Execute npm i Broker - Backend
    sshpass -p "$password" ssh "$server" "cd /var/www/backend/brokerbackend && npm i"

   # Build Code
    sshpass -p "$password" rsync -avz  "$source_path_build" "$server:$remote_path1"

   # mongodb restart command
  #  sshpass -p "$password" ssh "$server" "systemctl restart mongod"

   # Reload broker server
    sshpass -p "$password" ssh "$server" "pm2 reload broker_server"

   # Reload app
   sshpass -p "$password" ssh "$server" "pm2 reload app"

   # Pm2 Update
  #  sshpass -p "$password" ssh "$server" "pm2 update"

  
    # Remove the password from the variable after using it

    unset password

done
