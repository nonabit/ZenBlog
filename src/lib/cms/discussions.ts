/**
 * GitHub Discussions API 服务
 * 用于获取 Giscus 评论数据（只读）
 */

import { graphql } from "@octokit/graphql";

// Giscus 配置（与 GiscusComments.tsx 保持一致）
const REPO_OWNER = "nonabit";
const REPO_NAME = "ZenBlog";
const CATEGORY_ID = "DIC_kwDOQZxLYc4C04o7";

// 类型定义
export interface DiscussionComment {
  id: string;
  author: {
    login: string;
    avatarUrl: string;
  } | null;
  body: string;
  bodyHTML: string;
  createdAt: string;
  url: string;
  replyCount: number;
}

export interface Discussion {
  id: string;
  number: number;
  title: string;
  url: string;
  createdAt: string;
  comments: {
    totalCount: number;
    nodes: DiscussionComment[];
  };
}

export interface DiscussionListItem {
  id: string;
  number: number;
  title: string;
  url: string;
  createdAt: string;
  commentsCount: number;
  // 从 pathname 映射中提取的文章 slug
  blogSlug: string | null;
}

// 创建 GraphQL 客户端
function createClient() {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is required for comments management");
  }
  return graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });
}

// 从 Discussion title 提取博客 slug
// Giscus 使用 pathname 映射时，title 格式为 "/blog/xxx"
function extractBlogSlug(title: string): string | null {
  const match = title.match(/^\/blog\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * 获取所有评论讨论列表
 */
export async function listDiscussions(
  first: number = 20,
  after?: string
): Promise<{ discussions: DiscussionListItem[]; hasNextPage: boolean; endCursor: string | null }> {
  const client = createClient();

  const query = `
    query($owner: String!, $name: String!, $categoryId: ID!, $first: Int!, $after: String) {
      repository(owner: $owner, name: $name) {
        discussions(first: $first, after: $after, categoryId: $categoryId, orderBy: {field: UPDATED_AT, direction: DESC}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            number
            title
            url
            createdAt
            comments {
              totalCount
            }
          }
        }
      }
    }
  `;

  const result: any = await client(query, {
    owner: REPO_OWNER,
    name: REPO_NAME,
    categoryId: CATEGORY_ID,
    first,
    after,
  });

  const discussions = result.repository.discussions.nodes.map((d: any) => ({
    id: d.id,
    number: d.number,
    title: d.title,
    url: d.url,
    createdAt: d.createdAt,
    commentsCount: d.comments.totalCount,
    blogSlug: extractBlogSlug(d.title),
  }));

  return {
    discussions,
    hasNextPage: result.repository.discussions.pageInfo.hasNextPage,
    endCursor: result.repository.discussions.pageInfo.endCursor,
  };
}

/**
 * 获取单个讨论的详情和评论
 */
export async function getDiscussion(
  number: number,
  commentsFirst: number = 50
): Promise<Discussion | null> {
  const client = createClient();

  const query = `
    query($owner: String!, $name: String!, $number: Int!, $commentsFirst: Int!) {
      repository(owner: $owner, name: $name) {
        discussion(number: $number) {
          id
          number
          title
          url
          createdAt
          comments(first: $commentsFirst) {
            totalCount
            nodes {
              id
              author {
                login
                avatarUrl
              }
              body
              bodyHTML
              createdAt
              url
              replies {
                totalCount
              }
            }
          }
        }
      }
    }
  `;

  const result: any = await client(query, {
    owner: REPO_OWNER,
    name: REPO_NAME,
    number,
    commentsFirst,
  });

  const d = result.repository.discussion;
  if (!d) return null;

  return {
    id: d.id,
    number: d.number,
    title: d.title,
    url: d.url,
    createdAt: d.createdAt,
    comments: {
      totalCount: d.comments.totalCount,
      nodes: d.comments.nodes.map((c: any) => ({
        id: c.id,
        author: c.author,
        body: c.body,
        bodyHTML: c.bodyHTML,
        createdAt: c.createdAt,
        url: c.url,
        replyCount: c.replies?.totalCount || 0,
      })),
    },
  };
}

/**
 * 获取评论统计
 */
export async function getCommentsStats(): Promise<{ totalDiscussions: number; totalComments: number }> {
  const client = createClient();

  const query = `
    query($owner: String!, $name: String!, $categoryId: ID!) {
      repository(owner: $owner, name: $name) {
        discussions(categoryId: $categoryId) {
          totalCount
        }
      }
    }
  `;

  const result: any = await client(query, {
    owner: REPO_OWNER,
    name: REPO_NAME,
    categoryId: CATEGORY_ID,
  });

  // 注意：获取总评论数需要遍历所有 discussions，这里只返回讨论数
  return {
    totalDiscussions: result.repository.discussions.totalCount,
    totalComments: 0, // 需要单独查询每个 discussion
  };
}
