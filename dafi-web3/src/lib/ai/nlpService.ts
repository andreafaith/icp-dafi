import { Configuration, OpenAIApi } from 'openai';
import Redis from 'ioredis';
import { AssetModel } from '../../models/Asset';
import { z } from 'zod';

const redis = new Redis(process.env.REDIS_URL!);
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export class NLPService {
  async generateAssetDescription(assetId: string) {
    try {
      const cacheKey = `nlp:description:${assetId}`;
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const asset = await AssetModel.findById(assetId)
        .populate('owner')
        .lean();

      if (!asset) throw new Error('Asset not found');

      const prompt = `Generate a detailed, professional description for this agricultural asset:
        Type: ${asset.type}
        Name: ${asset.name}
        Location: Latitude ${asset.location.latitude}, Longitude ${asset.location.longitude}
        Current Value: ${asset.financials.currentValue}
        Status: ${asset.status}
        Metrics: ${JSON.stringify(asset.tracking)}
        
        Please include:
        1. Overview of the asset
        2. Key features and capabilities
        3. Current performance metrics
        4. Investment potential
        5. Risk factors
        Format the response in markdown.`;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const description = {
        content: response.data.choices[0].text,
        metadata: {
          keywords: await this.extractKeywords(response.data.choices[0].text || ''),
          sentiment: await this.analyzeSentiment(response.data.choices[0].text || ''),
          readabilityScore: this.calculateReadabilityScore(response.data.choices[0].text || ''),
        },
      };

      // Cache the description
      await redis.setex(cacheKey, 3600, JSON.stringify(description));

      return description;
    } catch (error) {
      console.error('Description generation error:', error);
      throw error;
    }
  }

  async analyzeAssetDocuments(assetId: string) {
    try {
      const cacheKey = `nlp:analysis:${assetId}`;
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const asset = await AssetModel.findById(assetId).lean();
      if (!asset) throw new Error('Asset not found');

      const documentAnalyses = await Promise.all(
        asset.documents.map(async (doc: any) => {
          const prompt = `Analyze this agricultural asset document and extract key information:
            Document Type: ${doc.type}
            Content: ${doc.content}
            
            Please provide:
            1. Key findings
            2. Risk factors
            3. Compliance requirements
            4. Action items
            5. Recommendations`;

          const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            max_tokens: 500,
            temperature: 0.3,
          });

          return {
            documentType: doc.type,
            analysis: response.data.choices[0].text,
            metadata: {
              keywords: await this.extractKeywords(doc.content),
              sentiment: await this.analyzeSentiment(doc.content),
              entities: await this.extractEntities(doc.content),
            },
          };
        })
      );

      const analysis = {
        documents: documentAnalyses,
        summary: await this.generateDocumentSummary(documentAnalyses),
      };

      // Cache the analysis
      await redis.setex(cacheKey, 3600, JSON.stringify(analysis));

      return analysis;
    } catch (error) {
      console.error('Document analysis error:', error);
      throw error;
    }
  }

  async generateMarketingContent(assetId: string) {
    try {
      const cacheKey = `nlp:marketing:${assetId}`;
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const asset = await AssetModel.findById(assetId)
        .populate('owner')
        .lean();

      if (!asset) throw new Error('Asset not found');

      const prompt = `Create marketing content for this agricultural asset:
        Asset Details: ${JSON.stringify(asset)}
        
        Generate:
        1. Short description (50 words)
        2. Long description (200 words)
        3. Key selling points (bullet points)
        4. Investment highlights
        5. Social media posts (3 variations)
        
        Target audience: Agricultural investors and agribusiness professionals
        Tone: Professional, informative, and persuasive`;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = {
        generated: response.data.choices[0].text,
        metadata: {
          targetAudience: 'Agricultural investors',
          tone: 'Professional',
          keywords: await this.extractKeywords(response.data.choices[0].text || ''),
        },
        socialMedia: await this.generateSocialMediaPosts(asset),
      };

      // Cache the content
      await redis.setex(cacheKey, 3600, JSON.stringify(content));

      return content;
    } catch (error) {
      console.error('Marketing content generation error:', error);
      throw error;
    }
  }

  private async extractKeywords(text: string) {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Extract key phrases and keywords from this text:\n${text}\n\nKeywords:`,
      max_tokens: 100,
      temperature: 0.3,
    });

    return response.data.choices[0].text
      ?.split(',')
      .map(keyword => keyword.trim())
      .filter(Boolean);
  }

  private async analyzeSentiment(text: string) {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Analyze the sentiment of this text and provide a score between -1 (very negative) and 1 (very positive):\n${text}\n\nSentiment score:`,
      max_tokens: 10,
      temperature: 0.1,
    });

    return parseFloat(response.data.choices[0].text || '0');
  }

  private async extractEntities(text: string) {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Extract named entities (organizations, locations, dates, monetary values) from this text:\n${text}\n\nEntities:`,
      max_tokens: 200,
      temperature: 0.3,
    });

    return response.data.choices[0].text
      ?.split('\n')
      .map(entity => entity.trim())
      .filter(Boolean);
  }

  private calculateReadabilityScore(text: string) {
    // Implement Flesch-Kincaid readability score or similar
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const syllables = this.countSyllables(text);

    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.min(Math.max(0, score), 100);
  }

  private countSyllables(text: string) {
    // Simple syllable counting heuristic
    return text
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[^aeiou]+/g, ' ')
      .trim()
      .split(/\s+/).length;
  }

  private async generateDocumentSummary(analyses: any[]) {
    const combinedAnalysis = analyses
      .map(a => a.analysis)
      .join('\n\n');

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Summarize the key points from these document analyses:\n${combinedAnalysis}\n\nSummary:`,
      max_tokens: 300,
      temperature: 0.5,
    });

    return response.data.choices[0].text;
  }

  private async generateSocialMediaPosts(asset: any) {
    const prompt = `Create 3 engaging social media posts (Twitter, LinkedIn, Instagram) for this agricultural asset:
      Asset: ${asset.name}
      Type: ${asset.type}
      Key Features: ${JSON.stringify(asset.metadata)}
      
      Make them informative yet concise, include relevant hashtags, and focus on investment potential.`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.data.choices[0].text
      ?.split('\n\n')
      .filter(Boolean)
      .map(post => ({
        content: post,
        platform: post.includes('#') ? 'Twitter' : 'LinkedIn',
        hashtags: (post.match(/#\w+/g) || []).map(tag => tag.slice(1)),
      }));
  }
}
