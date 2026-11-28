import { SHAPE_CONFIG, DEFAULT_SHAPE } from '../constants/shapes';

const API_BASE_URL = 'https://localhost:7187/api';

const STRATEGY_TO_TYPE = {
  REMAINDER_OPTIMAL: 1,
  BALANCED_DISTRIBUTION: 2
};

// Chuẩn hóa 1 box từ BE (PascalCase hoặc camelCase) về 1 chuẩn camelCase duy nhất
const round2 = (num) => Math.round((Number(num) || 0) * 100) / 100;
const round4 = (num) => Math.round((Number(num) || 0) * 10000) / 10000;

function normalizeBox(box = {}) {
  const isRotated = Boolean(box.IsRotated ?? box.isRotated ?? false);
  const rawW = round2(box.Width ?? box.width ?? 0);
  const rawH = round2(box.Height ?? box.height ?? 0);
  const part = box.CuttingPart ?? box.cuttingPart ?? {};

  return {
    x: round4(box.X ?? box.x ?? 0),
    y: round4(box.Y ?? box.y ?? 0),
    width: isRotated ? rawH : rawW,
    height: isRotated ? rawW : rawH,
    stockSheetId: Number(box.sTockSheetID ?? box.STockSheetID ?? box.stockSheetId ?? 1),
    isRotated,
    cuttingPart: {
      id: part.ID ?? part.id,
      shape: part.Shape ?? part.shape ?? part.$type,
      sideLength: part.SideLength !== undefined ? round2(part.SideLength) : part.sideLength !== undefined ? round2(part.sideLength) : undefined,
      radius: part.Radius !== undefined ? round2(part.Radius) : part.radius !== undefined ? round2(part.radius) : undefined,
      radiusX: part.RadiusX !== undefined ? round2(part.RadiusX) : part.radiusX !== undefined ? round2(part.radiusX) : undefined,
      radiusY: part.RadiusY !== undefined ? round2(part.RadiusY) : part.radiusY !== undefined ? round2(part.radiusY) : undefined,
      majorAxis: part.MajorAxis !== undefined ? round2(part.MajorAxis) : part.majorAxis !== undefined ? round2(part.majorAxis) : undefined,
      minorAxis: part.MinorAxis !== undefined ? round2(part.MinorAxis) : part.minorAxis !== undefined ? round2(part.minorAxis) : undefined,
      width: part.Width !== undefined ? round2(part.Width) : part.width !== undefined ? round2(part.width) : undefined,
      height: part.Height !== undefined ? round2(part.Height) : part.height !== undefined ? round2(part.height) : undefined
    }
  };
}

// Chuẩn hóa bản ghi lịch sử từ BE về camelCase
function normalizeHistory(h = {}) {
  const inputData = h.inputData ?? h.InputData ?? {};
  const resultData = h.resultData ?? h.ResultData ?? {};

  const items = inputData.items ?? inputData.Items ?? [];
  const containers = inputData.containers ?? inputData.Containers ?? [];
  const strategy = inputData.strategy ?? inputData.Strategy ?? 'REMAINDER_OPTIMAL';

  const rawBoxes = resultData.placedBoxes ?? resultData.PlacedBoxes ?? (Array.isArray(resultData) ? resultData : []);
  const activeContainers = resultData.containers ?? resultData.Containers ?? containers;

  return {
    historyId: h.historyId ?? h.HistoryId,
    title: h.title ?? h.Title ?? 'Sơ đồ cắt phôi',
    createdAt: h.createdAt ?? h.CreatedAt,
    items,
    containers,
    strategy,
    placedBoxes: Array.isArray(rawBoxes) ? rawBoxes.map(normalizeBox) : [],
    activeContainers
  };
}

export async function calculateLayoutApi(items, containers, strategy) {
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

  const cuttingPack = [];
  items.forEach((item) => {
    const qty = Number(item.quantity) || 1;
    const shapeConfig = SHAPE_CONFIG[item.shape] || SHAPE_CONFIG[DEFAULT_SHAPE];
    const serialized = JSON.stringify(shapeConfig.toApiPayload(item.dimensions));

    for (let i = 0; i < qty; i++) {
      cuttingPack.push(serialized);
    }
  });

  const payload = {
    Type: STRATEGY_TO_TYPE[strategy] ?? 1,
    SawKerf: 0,
    StockSheets: stockSheets,
    CuttingPack: cuttingPack
  };

  const response = await fetch(`${API_BASE_URL}/CalculateLayout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Lỗi từ Server');
  }

  const result = await response.json();
  const rawBoxes = result?.data || result || [];

  return {
    boxes: Array.isArray(rawBoxes) ? rawBoxes.map(normalizeBox) : [],
    sheets: stockSheets.map((s) => ({
      id: s.ID,
      name: s.Name,
      width: s.Width,
      height: s.Height,
      quantity: 1
    }))
  };
}

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

export async function getUserHistoriesApi(userId) {
  const response = await fetch(`${API_BASE_URL}/History/user/${userId}`);
  const data = await response.json();
  if (!response.ok) throw new Error('Không thể tải lịch sử!');
  return Array.isArray(data) ? data.map(normalizeHistory) : [];
}