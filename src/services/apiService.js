const API_BASE_URL = 'https://localhost:7187/api';

export async function calculateLayoutApi(items, containers, strategy) {
  // 1. CHUẨN HÓA & NHÂN BẢN PHÔI (StockSheets) THEO QUANTITY VỚI ID DUY NHẤT
  const stockSheets = [];
  let sheetIdCounter = 1;

  containers.forEach((c) => {
    const qty = Number(c.quantity) || 1;
    const width = Number(c.width);
    const height = Number(c.height);
    const name = c.name || 'Tấm phôi';

    for (let i = 0; i < qty; i++) {
      stockSheets.push({
        ID: sheetIdCounter++,
        Width: width,
        Height: height,
        Quantity: 1,
        Name: qty > 1 ? `${name} (#${i + 1})` : name
      });
    }
  });

  if (stockSheets.length === 0) {
    stockSheets.push({ ID: 1, Width: 800, Height: 800, Quantity: 1, Name: 'Tấm A' });
  }

  // 2. CHUYỂN ĐỔI DANH SÁCH CHI TIẾT CẮT (CuttingPack)
  const cuttingPackData = [];

  items.forEach((item) => {
    const qty = Number(item.quantity) || 1;
    let shapeName = "Rectangle";
    let objData = {};

    switch (item.shape) {
      case 'CIRCLE':
        shapeName = "Circle";
        objData = { ShapeName: shapeName, Radius: Number(item.dimensions?.d || 100) / 2 };
        break;
      case 'RIGHT_TRIANGLE':
        shapeName = "RightAngledTriangle";
        objData = { ShapeName: shapeName, Base: Number(item.dimensions?.b || 100), Height: Number(item.dimensions?.h || 100) };
        break;
      case 'ISOSCELES_TRIANGLE':
        shapeName = "IsoscelesTriangle";
        objData = { ShapeName: shapeName, Base: Number(item.dimensions?.b || 100), Height: Number(item.dimensions?.h || 100) };
        break;
      case 'HEXAGON':
        shapeName = "RegularHexagon";
        objData = { ShapeName: shapeName, SideLength: Number(item.dimensions?.a || 100) };
        break;
      case 'ELLIPSE':
        shapeName = "Ellipse";
        objData = { ShapeName: shapeName, MajorAxis: Number(item.dimensions?.rx || 100), MinorAxis: Number(item.dimensions?.ry || 100) };
        break;
      case 'RECTANGLE':
      default:
        shapeName = "Rectangle";
        objData = { ShapeName: shapeName, Width: Number(item.dimensions?.w || 100), Height: Number(item.dimensions?.h || 100) };
        break;
    }

    for (let i = 0; i < qty; i++) {
      cuttingPackData.push(JSON.stringify(objData));
    }
  });

  // ⚡ 3. ÁNH XẠ STRATEGY SANG CÁC GIÁ TRỊ ENUM CỦA C# BE
  // 1 = MaximalRectanglesCutting (Tối ưu diện tích phần dư)
  // 2 = SlackDistributedMaxRects (Phân bố đều các chi tiết)
  let cuttingType = 1;
if (strategy === 'BALANCED_DISTRIBUTION') {
  cuttingType = 2; // Phân bố đều các chi tiết
} else if (strategy === 'REMAINDER_OPTIMAL') {
  cuttingType = 1; // Tối ưu diện tích phần dư
}

  // 4. ĐÓNG GÓI PAYLOAD VỚI DẠNG TYPE ĐÃ MAP LINH HOẠT
  const payload = {
    Type: cuttingType,
    SawKerf: 0,
    StockSheets: stockSheets,
    CuttingPack: cuttingPackData
  };

  console.log("🚀 Payload gửi sang C#:", payload);

  try {
    const response = await fetch(`${API_BASE_URL}/CalculateLayout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Lỗi từ Server');
    }

    const result = await response.json();
    console.log("🔥 [API Response] Kết quả JSON gốc từ C#:", result);

    const rawBoxes = result?.data || result || [];
// CHUẨN HÓA THUỘC TÍNH TRẢ VỀ CHO FE VÀ LƯU LỊCH SỬ
const normalizedBoxes = Array.isArray(rawBoxes) 
  ? rawBoxes.map((box) => {
      const isRotated = Boolean(box.IsRotated ?? box.isRotated ?? false);
      const rawW = Number(box.Width ?? box.width ?? 0);
      const rawH = Number(box.Height ?? box.height ?? 0);
      const part = box.CuttingPart ?? box.cuttingPart ?? {};

      return {
        x: Number(box.X ?? box.x ?? 0),
        y: Number(box.Y ?? box.y ?? 0),
        width: isRotated ? rawH : rawW,
        height: isRotated ? rawW : rawH,
        stockSheetId: Number(box.sTockSheetID ?? box.STockSheetID ?? box.stockSheetId ?? 1),
        isRotated: isRotated,
        // ⚡ Lưu trữ đầy đủ thuộc tính hình học để tái vẽ chính xác khi tải lịch sử
        cuttingPart: {
          id: part.ID ?? part.id,
          shape: part.Shape ?? part.shape ?? part.$type,
          sideLength: part.SideLength ?? part.sideLength,
          radius: part.Radius ?? part.radius,
          radiusX: part.RadiusX ?? part.radiusX,
          radiusY: part.RadiusY ?? part.radiusY,
          majorAxis: part.MajorAxis ?? part.majorAxis,
          minorAxis: part.MinorAxis ?? part.minorAxis,
          width: part.Width ?? part.width,
          height: part.Height ?? part.height
        }
      };
    })
  : [];
    return normalizedBoxes;

  } catch (error) {
    console.error('Lỗi API CalculateLayout:', error);
    throw error;
  }
}

// API Đăng ký tinh gọn (chỉ Email & Password)
export async function registerApi(email, password) {
  const response = await fetch(`${API_BASE_URL}/Auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Đăng ký thất bại!');
  return data;
}

// ⚡ Bổ sung API Đăng nhập
export async function loginApi(email, password) {
  const response = await fetch(`${API_BASE_URL}/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Đăng nhập thất bại!');
  return data;
}

// API Lưu Lịch Sử Cắt
export async function saveHistoryApi(userId, title, inputData, resultData) {
  const response = await fetch(`${API_BASE_URL}/History/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, title, inputData, resultData })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Lưu lịch sử thất bại!');
  return data;
}

// API Lấy Danh Sách Lịch Sử
export async function getUserHistoriesApi(userId) {
  const response = await fetch(`${API_BASE_URL}/History/user/${userId}`);
  const data = await response.json();
  if (!response.ok) throw new Error('Không thể tải lịch sử!');
  return data;
}