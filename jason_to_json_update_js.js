var flowFile = session.get();
if (flowFile != null) {
    var StreamCallback = Java.type("org.apache.nifi.processor.io.StreamCallback")
    var IOUtils = Java.type("org.apache.commons.io.IOUtils")
    var StandardCharsets = Java.type("java.nio.charset.StandardCharsets")
    var JString = Java.type("java.lang.String")


    flowFile = session.write(flowFile,
        new StreamCallback(function(inputStream, outputStream) {
            var text = IOUtils.toString(inputStream, StandardCharsets.UTF_8)
            var obj = JSON.parse(text)
            var dateString = obj["timestamp"]
            var splitD = dateString.split(" ");
            var year = splitD[0].split("/")[2];
            var month = splitD[0].split("/")[1];
            var day = splitD[0].split("/")[0];

            var hour = splitD[1].split(":")[0];
            var min = splitD[1].split(":")[1];
            var second = splitD[1].split(":")[2];

            var epoch = new Date(
                year,
                Number(month) - 1,
                day,
                hour,
                min,
                second
            ).getTime();
            obj["date"] = epoch.toString()
            var builder = new JString()
            outputStream.write(JSON.stringify(obj, null, '\t').getBytes(StandardCharsets.UTF_8))
        }))
    flowFile = session.putAttribute(flowFile, "filename", flowFile.getAttribute('filename').split('.')[0] + '_translated.json')
    session.transfer(flowFile, REL_SUCCESS)
}
