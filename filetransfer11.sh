#!/bin/bash

# Source file/folder path
source_path="/var/www/backend/BACKEND"
source_path_bb="/var/www/backend/brokerbackend"
source_path_build="/var/www/software.algobullstradingsolutions.com/"

remort_path="/var/www/backend/"


# List of destination servers "root@172.105.43.81"
servers=("root@193.239.237.93")

# Loop through each server and transfer the file/folder
for server in "${servers[@]}"; do

    read -s -p "Enter the password for $server: " password

    echo "Transferring to $server"
    # Use scp to copy the file/folder
#    scppass -p "$password" "$source_path" "$server:$source_path"
    # Use scp to copy the file/folder
#    sshpass -p "$password" scp -r -o StrictHostKeyChecking=no "$source_path" "$server:$source_path"

    sshpass -p "$password" rsync -avz --exclude ".env" --exclude ".gitignore" --exclude "shakirTeting.js" --exclude "node_modules" --exclude "Logs" "$source_path" "$server:$remort_path"

    sshpass -p "$password" rsync -avz --exclude ".env" --exclude ".gitignore" --exclude "shakirTeting.js" --exclude "node_modules" --exclude "Logs" "$source_path_bb" "$server:$remort_path"

    remote_path1=$(sshpass -p "$password" ssh "$server" find "/var/www/" -maxdepth 1 -mindepth 1 -type d -name "*.*.*")

    echo "$remote_path1"

    sshpass -p "$password" rsync -avz  "$source_path_build" "$server:$remote_path1"

#    scp -r -o StrictHostKeyChecking=no -P "$password" "$source_path" "$server:$source_path"

    # Remove the password from the variable after using it
    unset password

done
