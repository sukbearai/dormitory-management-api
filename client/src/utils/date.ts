/**
 * 日期格式化工具函数
 */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/zh-cn';

// 加载相对时间插件
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
// 设置语言为中文
dayjs.locale('zh-cn');
// 设置默认时区为亚洲/上海（UTC+8）
dayjs.tz.setDefault('Asia/Shanghai');

/**
 * 格式化日期为 YYYY-MM-DD HH:mm:ss 格式
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date | number): string {
  if (!date) return '';
  
  const d = dayjs.utc(date).tz();
  
  if (!d.isValid()) {
    return '';
  }
  
  return d.format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
export function formatDateShort(date: string | Date | number): string {
  if (!date) return '';
  
  const d = dayjs(date).tz();
  
  if (!d.isValid()) {
    return '';
  }
  
  return d.format('YYYY-MM-DD');
}

/**
 * 获取相对时间描述（如：刚刚、5分钟前、1小时前等）
 * @param date 日期字符串或Date对象
 * @returns 相对时间描述
 */
export function getRelativeTime(date: string | Date | number): string {
  if (!date) return '';
  
  const d = dayjs(date).tz();
  
  if (!d.isValid()) {
    return '';
  }
  
  const now = dayjs().tz();
  const diffInDays = now.diff(d, 'day');
  
  // 如果超过30天，返回标准格式
  if (diffInDays > 30) {
    return formatDate(date);
  }
  
  // 否则返回相对时间
  return d.fromNow();
}