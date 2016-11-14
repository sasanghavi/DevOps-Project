import psutil
import math
print int(math.floor(psutil.cpu_percent(interval=1)))
