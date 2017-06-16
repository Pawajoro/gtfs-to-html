const fs = require('fs');
const path = require('path');

const archiver = require('archiver');
const sanitize = require('sanitize-filename');

exports.zipFolder = exportPath => {
  const output = fs.createWriteStream(path.join(exportPath, 'timetables.zip'));
  const archive = archiver('zip');

  return new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.glob(`${exportPath}/**/*.{txt,css,html}`);
    archive.finalize();
  });
};

exports.generateFolderName = timetablePage => {
  // Use first timetable in timetable page for start date and end date
  const timetable = timetablePage.timetables[0];
  return sanitize(`${timetable.start_date}-${timetable.end_date}`);
};

exports.getTemplateFile = config => {
  if (config.templatePath !== undefined) {
    return config.templatePath;
  } else if (config.noHead === true) {
    return path.join(__dirname, '..', 'views/timetable/timetablepage.pug');
  }

  return path.join(__dirname, '..', 'views/timetable/timetablepage_full.pug');
};