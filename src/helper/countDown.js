export const countdownInit = (el) => {
  const countDown = el;
  const countDownDate = new Date(
    countDown.getAttribute("data-countdown")
  ).getTime();
  const countDownHours = countDown.querySelector(".countdown__hours");
  const countDownMinutes = countDown.querySelector(".countdown__minutes");
  const countDownSeconds = countDown.querySelector(".countdown__seconds");
  const countSplit = countDown.getAttribute("data-split") === "true";
  let x = setInterval(function () {
    let now = new Date().getTime();
    let distance = countDownDate - now;

    if (distance < 0) {
      countDown.innerHTML = "<div>EXPIRED</div>";
      clearInterval(x);
    }

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const hoursText = hours.toString().padStart(2, "0");
    const minutesText = minutes.toString().padStart(2, "0");
    const secondsText = seconds.toString().padStart(2, "0");

    countDownHours.innerHTML = Array.from(hoursText)
      .map((num) => `<span>${num}</span>`)
      .join("");
    countDownMinutes.innerHTML = Array.from(minutesText)
      .map((num) => `<span>${num}</span>`)
      .join("");
    countDownSeconds.innerHTML = Array.from(secondsText)
      .map((num) => `<span>${num}</span>`)
      .join("");
  }, 1000);

  return x;
};
