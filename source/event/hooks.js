/*\
title: $:/plugins/neuroforest/core/event/hooks.js
type: application/javascript
module-type: startup
\*/

const fs = require("fs");

/*
Write trace to local file system
*/
function trace(messageElements, suffix) {
  if (messageElements[0].startsWith("Draft of ")) {
    return;
  }
  var dataPath = process.env.NF_DATA;
  if (!dataPath) {
    return;
  }
  var now = new Date();
  var yearMonth = $tw.utils.formatDateString(now, "YYYY-0MM");
  var yearMonthDay = $tw.utils.formatDateString(now, "YYYY-0MM-0DD");
  var moment = $tw.utils.stringifyDate(now);
  messageElements.unshift(moment);

  var traceDir = `${dataPath}/traces/${yearMonth}`

  if (!fs.existsSync(traceDir)) {
    fs.mkdir(traceDir, { recursive: true }, function(err) {
      if (err) throw err;
        console.log(`Error creating directory ${traceDir}`);
    });
  }

  var traceFile = `${traceDir}/${yearMonthDay}-${suffix}.txt`;
  var entry = messageElements.join("|") + "\n";
  fs.appendFile(traceFile, entry, function(err) {
    if (err) {
      console.error("Error writing to file:", err);
    }
  });
  console.log(`neuroforest/core: Trace '${messageElements[1]}'`)
}


$tw.hooks.addHook("th-saving-tiddler", function(tiddler) {
  if (!tiddler.fields["nid"]) {
    console.log(`neuroforest/core: Adding "nid" field: ${tiddler.fields.title}`)
    var newTiddler = new $tw.Tiddler(tiddler.fields, {"nid": $tw.utils.genUUID()});
  } else {
    var newTiddler = tiddler;
  }
  trace([tiddler.fields["title"], newTiddler.fields["nid"]], "save");
  return newTiddler;
});

$tw.hooks.addHook("th-navigating", function(tiddler) {
  var target = tiddler.navigateTo;
  var targetTiddler = $tw.wiki.getTiddler(target);
  if (!targetTiddler) {
    return tiddler;
  } else {
    var targetUuid = $tw.wiki.getTiddler(target).fields["nid"];
    if (tiddler.navigateFromTitle) {
      var source = tiddler.navigateFromTitle;
      var sourceUuid = $tw.wiki.getTiddler(source).fields["nid"];
      trace([target, targetUuid, source, sourceUuid], "navigate")
    } else {
      trace([target, targetUuid, "", ""], "navigate")
    }
    return tiddler;
  }
});
