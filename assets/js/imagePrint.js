function printClip(canvas, name) {
    var clipImgBase64 = canvas.toDataURL()
    // create image
    var clipImg = new Image()
    clipImg.src = clipImgBase64
    var con = confirm('Do you want to print the chart? \nClick cancel will save the image.')
    if (con) {
        $(clipImg).print()
    }else {
        downloadIamge(clipImgBase64, name)
    }
}

function downloadIamge(imgUrl, imgName) {
    var a = document.createElement('a')
    // create click event
    var event = new MouseEvent('click')
    // create image name
    var name = imgName + '.png';
    a.download = name
    // set the image url as the attr herf
    a.href = imgUrl;
    // click and download
    a.dispatchEvent(event);
}
