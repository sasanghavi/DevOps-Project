#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $DIR
cpuf=1
memf=1
while :
do
    cpuOutput=$(python $DIR/cpu.py)
    echo "cpu :$cpuOutput"
    if [[ $cpuOutput > 45 ]] && [[ $cpuf = 1 ]]; then
	cpuf=0
	echo "inside cpu : $cpuOutput"
        echo The CPU usage is high. $cpuOutput%  | mail -s "High CPU usage" sasanghavi@gmail.com
	sleep 10m
    elif [[ $cpuOutput < 40 ]]; then
	echo "safe"
	cpuf=1
    fi
    memOutput=$(python $DIR/mem.py)
    echo "Mem : $memOutput"
    #echo $memf
    if [ $memOutput > 45 ] && [[ $memf = 1 ]]; then
        memf=0
        echo The Memory usage is high. $memOutput%  | mail -s "High Memory usage" sasanghavi@gmail.com
	sleep 10m
    elif [[ $memOutput < 40 ]]; then
	echo "Safe mem"
        memf=1
    fi
    sleep 2m
done
