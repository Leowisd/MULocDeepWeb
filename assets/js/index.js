var map = new Datamap({
    element: document.getElementById("map"),
    geographyConfig: {
      popupOnHover: false,
      highlightOnHover: false
    },
    fills: {
      defaultFill: '#ccc',
      B: 'blue'
    }
  })

  map.addPlugin("fadingBubbles", fadingBubbles);

  drawBubbles = function (data) {
    data.forEach(function (datum, index) {

      setTimeout(function () {

        map.fadingBubbles([datum]);

      }, index * 100);

    });
  }

  var bubblesURL = "/process/location/"
  $.get(bubblesURL, function (bubbles_list, status) {
    drawBubbles(bubbles_list);
    var sleep = (bubbles_list.length - 1) * 1000;
    setInterval(function () {
      drawBubbles(bubbles_list);
    }, sleep);
  })


  var statisticUserURL = '/process/statistic/users';
  $.get(statisticUserURL, function (data, status) {
    var userNumber = document.getElementById("userNumber");
    userNumber.textContent = "The number of total user is: " + data.user;
  });

  var statisticQueryURL = '/process/statistic/querys';
  $.get(statisticQueryURL, function (data, status) {
    var queryNumber = document.getElementById("queryNumber");
    queryNumber.textContent = "The number of total querys is: " + data.querys;
  });