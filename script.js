// گرفتن المان‌های ساعت، تاریخ و دکمه‌ی تغییر تم از صفحه HTML
const clock = document.getElementById("clock");
const date = document.getElementById("date");
const themeBtn = document.getElementById("themeSwitcher");

// ✅ تابعی برای بروزرسانی ساعت در لحظه
function updateClock() {
  // گرفتن زمان فعلی از سیستم
  const now = new Date();

  // گرفتن ساعت، دقیقه، ثانیه
  const hours = String(now.getHours()).padStart(2, "0");   // اگر تک رقمی بود، صفر جلوش بذار
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // نمایش در تگ ساعت
  clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// ✅ تابعی برای تبدیل تاریخ میلادی به شمسی
function toJalali(gDate) {
  const gYear = gDate.getFullYear();      // سال میلادی
  const gMonth = gDate.getMonth() + 1;    // ماه میلادی (0 تا 11 هست، پس +1 می‌زنیم)
  const gDay = gDate.getDate();           // روز ماه

  // آرایه‌ای برای تعداد روزهای ماه‌های میلادی تا قبل از ماه جاری
  const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];

  // تعیین مبدا برای الگوریتم
  let jy; // سال شمسی
  let gy; // سال میلادی اصلاح‌شده

  if (gYear > 1600) {
    jy = 979;
    gy = gYear - 1600;
  } else {
    jy = 0;
    gy = gYear - 621;
  }

  // اگر ماه بعد از فوریه باشه (یعنی ماه سوم به بعد)، یک سال جلوتر حساب می‌شه
  const gy2 = (gMonth > 2) ? (gy + 1) : gy;

  // محاسبه تعداد روزهای سپری‌شده از مبدا
  let days =
    (365 * gy) +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gDay +
    g_d_m[gMonth - 1];

  // تبدیل روزها به سال شمسی
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;

  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  // محاسبه ماه شمسی
  const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);

  // محاسبه روز ماه شمسی
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));

  // خروجی به صورت یک آبجکت
  return { jy, jm, jd };
}

// ✅ تابعی برای بروزرسانی تاریخ شمسی
function updateDate() {
  const now = new Date();             // زمان فعلی
  const { jy, jm, jd } = toJalali(now); // تبدیل به شمسی

  // افزودن صفر جلوی اعداد تک‌رقمی
  const year = jy;
  const month = String(jm).padStart(2, "0");
  const day = String(jd).padStart(2, "0");

  // نمایش در تگ تاریخ
  date.textContent = `${year}/${month}/${day}`;
}

// ✅ تابعی برای تغییر تم بین روشن و تاریک
function toggleTheme() {
  // اگر کلاس dark روی body بود، حذف می‌کنه وگرنه اضافه می‌کنه
  document.body.classList.toggle("dark");

  // ذخیره کردن وضعیت تم در localStorage
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
}

// ✅ تابعی برای لود کردن تم ذخیره‌شده از قبل (بعد از باز کردن صفحه)
function loadTheme() {
  const savedTheme = localStorage.getItem("theme"); // خواندن از localStorage
  if (savedTheme === "dark") {
    document.body.classList.add("dark"); // اعمال حالت تاریک
  }
}

// ✅ اجرای توابع موقع باز شدن صفحه

loadTheme();       // تم ذخیره‌شده رو لود کن
updateClock();     // ساعت رو نشون بده
updateDate();      // تاریخ شمسی رو نشون بده

// بروزرسانی ساعت هر ثانیه یک بار
setInterval(updateClock, 1000);

// وقتی روی دکمه تغییر تم کلیک شد، toggleTheme اجرا شه
themeBtn.addEventListener("click", toggleTheme);