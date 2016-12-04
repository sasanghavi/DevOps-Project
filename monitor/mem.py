import psutil
import math
print int(math.floor(psutil.virtual_memory().percent))
