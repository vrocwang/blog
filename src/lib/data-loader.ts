/**
 * 通用数据加载方法
 * 用于从 public 目录加载页面数据
 */

/**
 * 加载指定路径的 JSON 数据
 * @param path - public 目录下的相对路径，不包含 /public 前缀
 * @returns 解析后的 JSON 数据
 */
export async function loadData<T>(path: string): Promise<T> {
  try {
    const response = await fetch(path)
    if (!response.ok) {
      throw new Error(`Failed to load data from ${path}: ${response.status} ${response.statusText}`)
    }
    return await response.json()
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