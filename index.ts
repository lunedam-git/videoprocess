// export FFMPEG_PATH="/opt/homebrew/bin/ffmpeg"
// export FFPROBE_PATH="/opt/homebrew/bin/ffprobe"

// import FFmpeg from 'fluent-ffmpeg-7';
// import temp from 'temp-write';

import FFmpeg from 'fluent-ffmpeg';

// Function to get video dimensions
// async function getDimensions(media) {
//   return new Promise((resolve, reject) => {
//     FFmpeg.ffprobe(media, (err, metadata) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       const videoStream = metadata.streams.find((stream) => stream.codec_type === 'video');
//       if (videoStream) {
//         resolve({ width: videoStream.width, height: videoStream.height });
//       } else {
//         reject(new Error('No video stream found'));
//       }
//     });
//   });
// }

// Function to resize, pad, and trim video
async function resizeAndPadVideo(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    FFmpeg(videoPath)
      .setStartTime(0)
      .setDuration(60) // Trim to 60 seconds
      .size(`720x?`)
      .aspect('16:9')
      .autopad()
      .format('mp4')
      .output(outputPath)
      // .withVideoCodec('copy') // Use 'copy' codec to avoid re-encoding
      // .withAudioCodec('copy') // Use 'copy' codec to avoid re-encoding
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Processing: ${Math.floor(progress.percent)}% done`);
        }
      })
      .on('error', (err) => reject(err))
      .on('end', () => resolve(outputPath))
      .run();
  });
}

async function takeScreenShot(movie) {
  return new Promise((resolve, reject) => {
    FFmpeg(movie)
      .on('filenames', function (filenames) {
        console.log('Will generate ' + filenames.join(', '));
      })
      .on('end', function () {
        resolve('Screenshots taken');
      })
      .screenshots({
        count: 1,
        timestamps: ['5%'],
        filename: 'poster.jpg',
        folder: '.',
        // size: '720x405',
      })
      .outputOptions('-q:v', '1');
  });
}

// Example usage
// const videoPath = '2min.mov';
// const outputPath = 'converted.mp4';
// resizeAndPadVideo(videoPath, outputPath)
//   .then((outputPath) => {
//     console.log('Video converted, trimmed, and saved at:', outputPath);
//   })
//   .then(() => {
//     takeScreenShot(outputPath);
//   })
//   .catch((error) => {
//     console.error('Error converting video:', error);
//   });

(async () => {
  try {
    const videoPath = 'bigbuck.mp4';
    const outputPath = 'converted.mp4';
    console.time('process_video');
    await resizeAndPadVideo(videoPath, outputPath);
    console.timeEnd('process_video');
    await takeScreenShot(outputPath);
  } catch (error) {
    console.error('Error converting video:', error);
  }
})();
