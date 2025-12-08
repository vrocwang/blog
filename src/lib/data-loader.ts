/**
 * 通用数据加载方法
 * 用于从 public 目录加载页面数据
 */

// 缓存存储
const dataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

/**
 * 加载指定路径的 JSON 数据
 * @param path - public 目录下的相对路径，不包含 /public 前缀
 * @returns 解析后的 JSON 数据
 */
export async function loadData<T>(path: string): Promise<T> {
  // 检查缓存
  const cached = dataCache.get(path);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  try {
    const response = await fetch(path)
    if (!response.ok) {
      throw new Error(`Failed to load data from ${path}: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    
    // 存储到缓存
    dataCache.set(path, { data, timestamp: Date.now() })
    
    return data
  } catch (error) {
    console.error(`Error loading data from ${path}:`, error)
    throw error
  }
}

/**
 * 加载页面列表数据
 * @param pageName - 页面名称，对应 public/data/{pageName}.json
 * @returns 解析后的 JSON 数据
 */
export async function loadPageList<T>(pageName: string): Promise<T> {
  return loadData<T>(`/data/${pageName}.json`)
}

/**
 * 分页加载数据
 * @param pageName - 页面名称
 * @param page - 页码（从1开始）
 * @param pageSize - 每页大小
 * @returns 分页数据和总数量
 */
export async function loadPageListPaginated<T>(pageName: string, page: number, pageSize: number): Promise<{ data: T[]; total: number }> {
  const allData = await loadPageList<T[]>(pageName);
  const total = allData.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = allData.slice(start, end);
  
  return { data, total };
}

/**
 * 专门用于加载各页面数据的函数
 */
export async function loadShareData() {
  return loadPageList<any[]>('share')
}

export async function loadProjectsData() {
  return loadPageList<any[]>('projects')
}

export async function loadBloggersData() {
  return loadPageList<any[]>('bloggers')
}

export async function loadPicturesData() {
  return loadPageList<any[]>('pictures')
}

export async function loadAboutData() {
  return loadPageList<any>('about')
}

/**
 * 清除特定路径的缓存
 * @param path - 要清除缓存的路径
 */
export function clearCache(path: string) {
  dataCache.delete(path);
}

/**
 * 清除所有缓存
 */
export function clearAllCache() {
  dataCache.clear();
}