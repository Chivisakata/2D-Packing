const API_BASE_URL = 'https://localhost:7187/api';

export async function calculateLayoutApi(items, containers, strategy) {
  // ⚡ 1. CHUẨN HÓA & NHÂN BẢN PHÔI (StockSheets) THEO QUANTITY VỚI ID DUY NHẤT (1, 2, 3...)
  const stockSheets = [];
  let sheetIdCounter = 1;

  containers.forEach((c) => {
    const qty = Number(c.quantity) || 1;
    const width = Number(c.width);
    const height = Number(c.height);
    const name = c.name || 'Tấm phôi';

    // Nhân bản từng tấm phôi thực tế để C# hiểu và phân bổ chi tiết chuẩn xác
    for (let i = 0; i < qty; i++) {
      stockSheets.push({
        ID: sheetIdCounter++, // ⚡ ID luôn là số nguyên tăng dần 1, 2, 3... không lo trùng!
        Width: width,
        Height: height,
        Quantity: 1, // Đã tách thành từng tấm riêng biệt
        Name: qty > 1 ? `${name} (#${i + 1})` : name
      });
    }
  });

  if (stockSheets.length === 0) {
    stockSheets.push({ ID: 1, Width: 1200, Height: 800, Quantity: 1, Name: 'Tấm A' });
  }

  // 2. Chuyển đổi danh sách chi tiết cắt (CuttingPack)
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

  // 3. Đóng gói Payload
  const payload = {
    Type: 1, // 1 = MaximalRectanglesCutting
    SawKerf: 0,
    StockSheets: stockSheets,
    CuttingPack: cuttingPackData
  };

  console.log("🚀 Payload gửi sang C# (Đã tách ID phôi chuẩn):", payload);

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

    // ⚡ CHUẨN HÓA THUỘC TÍNH
    // ⚡ CHUẨN HÓA THUỘC TÍNH: Bổ sung sTockSheetID (s nhỏ, T hoa)
    const normalizedBoxes = Array.isArray(rawBoxes) 
      ? rawBoxes.map((box) => {
          const isRotated = Boolean(box.IsRotated ?? box.isRotated ?? false);
          const rawW = Number(box.Width ?? box.width ?? 0);
          const rawH = Number(box.Height ?? box.height ?? 0);

          return {
            x: Number(box.X ?? box.x ?? 0),
            y: Number(box.Y ?? box.y ?? 0),
            width: isRotated ? rawH : rawW,
            height: isRotated ? rawW : rawH,
            // 🎯 BẮT ĐÚNG TÊN FIELD C# TRẢ VỀ: sTockSheetID
            stockSheetId: Number(box.sTockSheetID ?? box.STockSheetID ?? box.stockSheetId ?? 1),
            isRotated: isRotated
          };
        })
      : [];

    return normalizedBoxes;

  } catch (error) {
    console.error('Lỗi API CalculateLayout:', error);
    throw error;
  }
}