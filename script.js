// ================================
// 1. CẤU HÌNH API
// ================================
// Để trống URL_API khi chỉ muốn chạy giao diện demo.
// Khi có backend, thay bằng URL API thật, ví dụ:
// const API_BASE_URL = "https://your-api.example.com";
const API_BASE_URL = "";

// Chế độ demo: các nút chỉ thay đổi giao diện, không điều khiển phần cứng.
const DEMO_MODE = true;

// Trạng thái giao diện ban đầu
const devices = {
  light: false,
  fan: false
};

// ================================
// 2. LẤY CÁC PHẦN TỬ HTML
// ================================
const lightToggle = document.querySelector("#lightToggle");
const fanToggle = document.querySelector("#fanToggle");
const lightStatus = document.querySelector("#lightStatus");
const fanStatus = document.querySelector("#fanStatus");
const temperature = document.querySelector("#temperature");
const humidity = document.querySelector("#humidity");
const apiMessage = document.querySelector("#apiMessage");
const connectionText = document.querySelector("#connectionText");
const connectionDot = document.querySelector("#connectionDot");

// ================================
// 3. HIỂN THỊ THỜI GIAN
// ================================
function updateClock() {
  const now = new Date();

  document.querySelector("#currentTime").textContent =
    now.toLocaleTimeString("vi-VN");

  document.querySelector("#currentDate").textContent =
    now.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
}

updateClock();
setInterval(updateClock, 1000);

// ================================
// 4. CẬP NHẬT GIAO DIỆN THIẾT BỊ
// ================================
function renderDevice(deviceName) {
  const isOn = devices[deviceName];
  const button = deviceName === "light" ? lightToggle : fanToggle;
  const status = deviceName === "light" ? lightStatus : fanStatus;

  button.setAttribute("aria-checked", String(isOn));
  status.textContent = isOn ? "Đang bật" : "Đang tắt";
  status.classList.toggle("active", isOn);
}

// ================================
// 5. GỬI LỆNH BẬT/TẮT
// ================================
async function setDevice(deviceName, turnOn) {
  // Chưa kết nối backend: chạy demo ở trình duyệt.
  if (DEMO_MODE || !API_BASE_URL) {
    devices[deviceName] = turnOn;
    renderDevice(deviceName);
    apiMessage.textContent =
      `[Demo] ${deviceName} đã được ${turnOn ? "bật" : "tắt"} trên giao diện. Chưa gửi lệnh đến thiết bị thật.`;
    return;
  }

  // Ví dụ hợp đồng API mà backend có thể triển khai.
  // Endpoint và cấu trúc JSON này là ví dụ, chưa phải API có sẵn.
  try {
    apiMessage.textContent = "Đang gửi lệnh...";

    const response = await fetch(`${API_BASE_URL}/api/devices/${deviceName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ state: turnOn ? "on" : "off" })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    // Chỉ cập nhật giao diện sau khi API xác nhận thành công.
    devices[deviceName] = turnOn;
    renderDevice(deviceName);
    apiMessage.textContent = result.message || "API đã nhận lệnh thành công.";
  } catch (error) {
    apiMessage.textContent = `Không gửi được lệnh: ${error.message}`;
  }
}

lightToggle.addEventListener("click", () => {
  setDevice("light", !devices.light);
});

fanToggle.addEventListener("click", () => {
  setDevice("fan", !devices.fan);
});

// ================================
// 6. ĐỌC TRẠNG THÁI TỪ API BẰNG FETCH
// ================================
async function refreshStatus() {
  if (DEMO_MODE || !API_BASE_URL) {
    apiMessage.textContent =
      "Chế độ demo đang bật. Chưa có API để đọc trạng thái thiết bị thật.";
    connectionText.textContent = "Chế độ demo";
    connectionDot.classList.remove("online");
    connectionDot.classList.add("offline");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/status`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Ví dụ JSON mong đợi từ backend:
    // {
    //   "light": true,
    //   "fan": false,
    //   "temperature": 29.5,
    //   "humidity": 68
    // }
    devices.light = Boolean(data.light);
    devices.fan = Boolean(data.fan);
    renderDevice("light");
    renderDevice("fan");

    if (data.temperature !== undefined) {
      temperature.textContent = data.temperature;
    }
    if (data.humidity !== undefined) {
      humidity.textContent = data.humidity;
    }

    connectionText.textContent = "Đã nhận dữ liệu API";
    connectionDot.classList.remove("offline");
    connectionDot.classList.add("online");
    apiMessage.textContent = "Đã cập nhật trạng thái từ API.";
  } catch (error) {
    connectionText.textContent = "Không kết nối được API";
    connectionDot.classList.remove("online");
    connectionDot.classList.add("offline");
    apiMessage.textContent =
      `Lỗi khi đọc trạng thái: ${error.message}. Kiểm tra URL API, mạng và CORS.`;
  }
}

document.querySelector("#refreshButton").addEventListener("click", refreshStatus);

document.querySelector("#demoButton").addEventListener("click", () => {
  temperature.textContent = "29.5";
  humidity.textContent = "68";
  apiMessage.textContent =
    "Đã hiển thị dữ liệu cảm biến mẫu. Đây không phải số đo thực tế.";
});

// Khởi tạo trạng thái trên giao diện
renderDevice("light");
renderDevice("fan");
refreshStatus();
