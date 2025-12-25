import { GoogleGenAI } from "@google/genai";
import { EventItem, EventType } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWish = async (event: EventItem): Promise<string> => {
  try {
    const ai = getClient();
    
    let prompt = `请用温暖、真诚的语气，用中文写一段简短的祝福语（100字以内）。`;
    
    if (event.type === EventType.BIRTHDAY) {
      prompt += `\n对象：${event.name}`;
      prompt += `\n类型：生日祝福`;
      if (event.notes) prompt += `\n备注信息：${event.notes}（请酌情结合这些信息）`;
    } else if (event.type === EventType.ANNIVERSARY) {
      prompt += `\n对象：${event.name}`;
      prompt += `\n类型：纪念日祝福`;
      if (event.notes) prompt += `\n备注信息：${event.notes}`;
    } else {
      prompt += `\n对象：${event.name}`;
      prompt += `\n事件：${event.notes || '特别的日子'}`;
    }

    prompt += `\n要求：不要包含任何标题，直接输出祝福内容。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Fast response needed
      }
    });

    return response.text || "祝你一切顺利！(AI 生成暂时不可用)";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "祝你节日快乐，万事如意！\n(网络连接异常，使用了默认祝福)";
  }
};