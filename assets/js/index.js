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
    var sleep = (bubbles_list.length - 1) * 100;
    setInterval(function () {
      drawBubbles(bubbles_list);
    }, sleep);
  })

  $("#userNumHead").fadeIn(1000);
  $("#userNumber").fadeIn(1000);
  var statisticUserURL = '/process/statistic/users';
  $.get(statisticUserURL, function (data, status) {
    $("#userNumber").numberAnimate({num: data.user, speed:3000, symbol:","});
  });

  $("#queryNumHead").fadeIn(2000);
  $("#queryNumber").fadeIn(2000);
  var statisticQueryURL = '/process/statistic/querys';
  $.get(statisticQueryURL, function (data, status) {
    $("#queryNumber").numberAnimate({num: data.querys, speed:4000, symbol:","});
  });

