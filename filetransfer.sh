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

# # List of destination servers "root@172.105.43.81"
  servers=(
  # "root@185.209.75.10"
  # "root@185.209.75.31" 
  # "root@217.145.69.40" 
  # "root@217.145.69.76" 
  # "root@217.145.69.39" 
  # "root@185.209.75.61" 
  # "root@217.145.69.44" 
  # "root@217.145.69.46" 
  # "root@185.209.75.2" 
  # "root@185.209.75.5" 
  # "root@185.209.75.8" 
  # "root@185.209.75.9"
  # "root@185.209.75.11" 
  # "root@185.209.75.12" 
  # "root@185.209.75.14" 
  # "root@185.209.75.15" 
  # "root@185.209.75.21" 
  # "root@185.209.75.23" 
  # "root@172.105.48.186" 
  # "root@185.209.75.27" 
  # "root@185.209.75.22" 
  # "root@185.209.75.28" 
  # "root@185.209.75.29" 
  # "root@185.209.75.30" 
  # "root@185.209.75.62" 
  # "root@185.209.75.63" 
  # "root@185.209.75.64" 
  # "root@185.209.75.65" 
  # "root@185.209.75.66" 
  # "root@185.209.75.67" 
  # "root@185.209.75.68" 
  # "root@185.209.75.69" 
  # "root@185.209.75.70"
  # "root@185.209.75.180"
  # "root@185.209.75.181"
  # "root@185.209.75.182"
  # "root@185.209.75.184"
  # "root@185.209.75.185"
  # "root@185.209.75.186"
  # "root@185.209.75.187"
  # "root@185.209.75.189"
  # "root@185.209.75.251"
  # "root@185.209.75.252"
  # "root@185.209.75.254"
  # "root@185.209.75.253" 
  # "root@185.209.75.191"
  # "root@185.209.75.192"
  # "root@185.209.75.190"
  # 'root@185.209.75.193'
  # 'root@185.209.75.194'
  # 'root@185.209.75.195'
  #  'root@185.209.75.196'
  # 'root@185.209.75.197'
  # 'root@185.209.75.199'
  # 'root@217.145.69.28'
  # 'root@217.145.69.27'
  # 'root@217.145.69.24'
  # 'root@217.145.69.25'
  # 'root@217.145.69.31'
  # 'root@217.145.69.26'
  # 'root@185.209.75.87'
  # 'root@185.209.75.88'
  # 'root@185.209.75.89'
  # 'root@185.209.75.90'
  # 'root@185.209.75.183'
  # 'root@5.178.98.2'
  # 'root@5.178.98.3'
  # 'root@5.178.98.5'
  # 'root@5.178.98.6'
  # 'root@5.178.98.7'
  'root@5.178.98.8'
  # 'root@5.178.98.9'
  # 'root@5.178.98.11'
  # 'root@5.178.98.12'
  #  'root@5.178.98.13'
  # 'root@5.178.98.15'
  # 'root@5.178.98.19'
  # 'root@5.178.98.17'
  # 'root@5.178.98.20'



  )  

# # Array to store remote paths for each server
  remotepath=(

  #   "software.corebizinfotech.com"
  #  "trade.codingpandit.com"
  #  "software.oneplanetitsolution.com" 
  #  "software.adonomist.com" 
  #  "software.algobullstradingsolutions.com" 
  #  "software.intelfintech.com" 
  #  "software.algokuber.com" 
  #  "software.finnshri.com" 
  #  "software.visioniq.in" 
  #  "software.believetechnology.in" 
  #  "software.realbottrading.com" 
  #  "software.growskyinfotech.com"  
  #  "software.inspirealgo.com" 
  #  "software.uniquetechnology.in" 
  #  "software.yourstechexpert.com" 
  #  "software.alphapulsepro.com" 
  #  "software.sumedhainn.com"
  #  "software.tradeonn.com" 
  #  "software.nationalalgo.com" 
  #  "software.vintyaitsolutions.com" 
  #  "software.growupalgo.com"  
  # "software.robotexfintech.com"
  #  "software.metaprogramming.in" 
  # "software.fincodify.com" 
  #  "software.invicontechnology.com" 
  #  "software.axcellencetechnology.com" 
  #  "software.sstechnologiess.com" 
  # "software.skwinvestmentadviser.com" 
  #  "software.satviktech.com" 
  # "software.thinkaumatictechnology.com" 
  #  "trade.visionresearchandsolution.com" 
  #  "software.smartwavetechnology.in" 
  #  "software.codinghornet.in"
  #  "software.inteltrade360.com"
  #  "software.fintechit.in"
  #  "software.thrivinginfotech.com"
  #  "software.visioncodesoftware.com"
  #  "trade.brightextech.com"
  #  "software.shinesofttrade.in"
  #  "software.algoruns.com"
  #  "software.techoceantechnologies.in"
  #  "software.brillianttechit.com"
  #  "software.newtimetechnologies.com"
  #  "software.darixosolution.com"
  #  "software.magmamultitrade.com"
  #  "software.intravisor.com"
  #  "software.procodetechnology.com"
#    "software.unitythesmartalgo.com"
#   "software.smartstox.in"
#   'software.visionmatictechnology.com/'
#   'software.winwaysoftwares.com'
#   'software.one-algo.com'
#   'software.unityhubitsolution.com'
#   'software.wealthcrafttechnology.com'
#   'software.techelitesolution.in'
#   'software.algosparks.in'
#   'software.ssfintech.com'
#   'software.rainfotech.com'
#   'software.technofin.tech'
#   'software.vittsurge.com'
#   'software.growwayalgo.com'
#   'software.evolgo.in'
#   'software.growonntechnologies.com'
#   'software.tradejockey.in'
#   'software.growingtech.in'
#   'software.shreedhasolutions.com'
#   'software.inovateinfotech.com'
#   'software.algobliss.com'
#   'software.idealalgo.com'
#   'software.apextechinnovative.com'
'software.algomoneybooster.com'
# 'software.eaglesofttech.com'
#   'software.algoweb.co.in'
# 'software.equityhero.in'
#  'software.celestialai.in'
# 'software.dynamictechsolution.com'
# 'app.nextbrand.tech'
# 'software.realcloudtechnology.com'
# 'software.moneyplatform.co.in'
   )


passwords=(

#   'WWmeCDzy37_^4%7*'
#  'xY3GH3#n^yv?_D89'
#  '5EslKC&Z7kt4@^*3'
#  'scR%!487C@yN0@Zn'
#  'PKjV#vs#6T_196q#'
#  'd@X19uYAF#9m5#a?'
#  '8DX_L&x6Qm#i93j*'
#  'XNgn?52J_&B3&iq8'
#  '&to6M*#?3LexD5U0'
#  '&pGhL^3d21f9'
#  '99@bggU3W5^WIb^@'
#  'KRNP&27am^v*&69e'
#  'TpWz638T$Ah&@_b0'
#  '$vcKz#2O5U!5Mq&9'
#  '0t_h5sUe8WG^_6N%'
#  '&1VR3s2@_tv$GhI2'
#  '^h2M%2$8S7HKjgm_'
#  'lG@Sp53kK1$#6#Mt'
#  '*R9triJLZa3O17Spoc0E'
#  '&cZk0%1XG$3$tMz1'
#  '6^Di3&9foMAm5?*O'
#  'WHN6$ixF!n^c^458'
#  '5X&H5c1^!^1YzFjo'
#  '%wG_W&1D6r^37Oav'
#  'YIF#9G3^6$b0vg&g'
#  'X#fT3A1!5h7#Nzl!'
#  'XN4KD0_!ex%l84%f'
#  '&ZF4z77RrfE%*7%p'
#  'xIOZ0^sP$&$18o2v'
#  'SbEO&*07ecU%1*r9'
#  'X1giX&%W4!6hkT9%'
#  'qm41E2*v&1g&RM%F'
#  'vX8O2@$axu$S2T2^'
#  'lA?63$8hhUq&F7*M'
#  'zm6*nB04USH1b?$@'
#  '6For57fj2#_Q?ZW@'
#  '$Jpi4U%y!vQL90&3'
#  '4!xbiU3SMg$D$6_5'
#  '55C^oamuW^2T4D*%'
#  '^uML73&3vw8#JAg%'
#  '9hVz884$M*o&rFU*'
#  'J8$PP*d1aC%lp6?8'
#  'V8*t@k16hJ2qJC^!'
#  '*oG^cHkU&@J4331c'
#  '@Wc7r@9UVb!K55q#'
#  '#%C1OfR5g9@&Dlm0'
#  '2wQ8c#L&7a&L&Kg9'
#  '2_4@L^l%7DVfxFq4'
#  '6zQ^&x%3poK5^L7T'
#  '^5r&Q!49eM*v1vFB'
#  'A3!eK%TRcx&457m_'
#  'zWHVLjdq5@2_9?2%'
#  '4e#QZ$13%7SHag?s'
#  'Oir?DV3#y$D23#u0'
#  'Rbc2!RQv4&s7J1%$'
#  '@c$Ks!4N0TUp53_w'
#  '4Ij87*Lvl^@9?ZsS'
#  'rF8%$d94%RdR0$fU'
#  '*TqD1&dm99B*J!g5'
#  'VD&u*6oGn5U!j75_'
#  'K?pv?GW&ws612G*9'
#  'hZPt%&wk$%863V4U'
#  'LtYl?l28O^D?u36?'
#  '0!^#PYr8_gTv5Ad3'
#  '_W#r32Udic#E9%Z8'
#  'J5S!Q8x7##Of%3hi'
#  '!^UM63_i8m$iAMe9' 
#  '*i#Nt5#183FXuUn!'
#  'o%%629A!!SE0Faib'
#  '*D5eI8cm%2^L0?vX'
'7lJ@X*75L1Fe@px%'
# 'k&$sRTy8?L2&I10g'

#  'eVUch7R8^i^^1!C9'
# '4VsgJ_^1Hps$1H7!'
#  '8dQ?XV1bK8d^@8o&'
# 'YFa1#@8fC_?i04Lb'
# '&TZ04&7zF%Uoo*k2'
# 'Ad9f_%WC^oVe132^'
# '*9Dy0?9Gm2WOwg&*'
)

   









# List of destination servers "root@172.105.43.81"
  # corebizinfotech diffrent frotend
  #  servers=("root@185.209.75.10") 
  #  remotepath=("software.corebizinfotech.com")



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
  sshpass -p "$password" rsync -avz --exclude ".env" --exclude ".gitignore" --exclude "node_modules" --exclude "Logs" "$source_file" "$server:$remort_path_file"

  sshpass -p "$password" rsync -avz --exclude ".env" --exclude ".gitignore" --exclude "node_modules" --exclude "Logs" "$source_file1" "$server:$remort_path_file1"

    # Execute npm i Backend
   sshpass -p "$password" ssh "$server" "cd /var/www/backend/BACKEND && npm i --force"

   # Broker Backend Cod
   sshpass -p "$password" rsync -avz --exclude ".env" --exclude ".gitignore" --exclude "node_modules" --exclude "AllPanelTextFile" --exclude "Logs" "$source_path_bb" "$server:$remort_path"
    
    # Execute npm i Broker - Backend
    sshpass -p "$password" ssh "$server" "cd /var/www/backend/brokerbackend && npm i"

   # Build Code
   sshpass -p "$password" rsync -avz  "$source_path_build" "$server:$remote_path1"
    

   # mongodb restart command
  #  sshpass -p "$password" ssh "$server" "systemctl restart mongod"

   # Reload broker server
    # sshpass -p "$password" ssh "$server" "pm2 reload broker_server"

   # Reload app
   sshpass -p "$password" ssh "$server" "pm2 reload app"
    

   # Pm2 Update
  sshpass -p "$password" ssh "$server" "pm2 update"
    # Remove the password from the variable after using it

    # unset password

done
