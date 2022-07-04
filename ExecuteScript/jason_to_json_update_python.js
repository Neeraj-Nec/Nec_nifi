import json
import java.io
from org.apache.commons.io import IOUtils
from java.nio.charset import StandardCharsets
from org.apache.nifi.processor.io import StreamCallback
import datetime
import time

class ModJSON(StreamCallback):
  def __init__(self):
        pass
  def process(self, inputStream, outputStream):
    text = IOUtils.toString(inputStream, StandardCharsets.UTF_8)
    obj = json.loads(text)
    date_example = obj['timestamp']
    d = datetime.datetime.strptime(date_example, "%d/%m/%Y %H:%M:%S")
    unix_time = int(time.mktime(d.timetuple()))
    obj['timestamp'] = str(unix_time)
    outputStream.write(bytearray(json.dumps(obj, indent=4).encode('utf-8')))

flowFile = session.get()
if (flowFile != None):
  flowFile = session.write(flowFile, ModJSON())
  flowFile = session.putAttribute(flowFile, "filename", flowFile.getAttribute('filename').split('.')[0]+'_translated.json')
session.transfer(flowFile, REL_SUCCESS)
session.commit()

