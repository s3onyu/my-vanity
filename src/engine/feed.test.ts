import { describe, expect, it } from 'vitest';
import type { BoardPost } from '@/types';
import { CONCERN_MAP } from '@/data/concerns';
import { FEED_TOPICS, feedSummary, hasFeedPreference, rankPosts, topicsOfPost } from './feed';

const NOW = new Date('2026-11-02T12:00:00+09:00').getTime();
const hoursAgo = (h: number) => new Date(NOW - h * 3_600_000).toISOString();

const post = (over: Partial<BoardPost>): BoardPost => ({
  id: 'p1',
  authorNickname: '테스터',
  concernCategory: 'dryness',
  title: '제목',
  body: '본문이에요',
  productName: null,
  verdict: 'good',
  imageUrl: null,
  likes: 0,
  createdAt: hoursAgo(1),
  ...over,
});

describe('관심 분야 정의', () => {
  it('id 가 겹치지 않고 모두 낱말이나 고민을 가진다', () => {
    expect(new Set(FEED_TOPICS.map((t) => t.id)).size).toBe(FEED_TOPICS.length);
    FEED_TOPICS.forEach((t) => {
      expect(t.keywords.length + t.concerns.length, t.id).toBeGreaterThan(0);
      expect(t.label.length, t.id).toBeGreaterThan(1);
      expect(t.concerns.every((c) => CONCERN_MAP[c]), t.id).toBe(true);
    });
  });

  it('낱말이 중복으로 적혀 있지 않다', () => {
    FEED_TOPICS.forEach((t) => expect(new Set(t.keywords).size, t.id).toBe(t.keywords.length));
  });
});

describe('글의 관심 분야 판정', () => {
  it('고민 카테고리로 분류된다', () => {
    expect(topicsOfPost(post({ concernCategory: 'dryness' }))).toContain('hydration');
    expect(topicsOfPost(post({ concernCategory: 'firming' }))).toContain('aging');
  });

  it('제목·본문의 낱말로도 분류된다', () => {
    const p = post({ concernCategory: 'barrier', title: '아이섀도 추천해주세요', body: '마스카라도 궁금해요' });
    expect(topicsOfPost(p)).toContain('eye-makeup');
    expect(topicsOfPost(p)).toContain('soothing'); // barrier 고민 카테고리
  });

  it('제품명도 함께 본다', () => {
    expect(topicsOfPost(post({ productName: '토너패드 60매', concernCategory: 'texture' }))).toContain('exfoliation');
  });

  it('걸리는 분야가 없으면 빈 목록을 준다', () => {
    expect(topicsOfPost(post({ concernCategory: 'breakout', title: 'ㅇㅇ', body: 'ㅁㅁ' })).includes('eye-makeup')).toBe(false);
  });
});

describe('노출 비중 조정', () => {
  const eye = post({ id: 'eye', title: '아이라인 그리는 법', concernCategory: 'texture', createdAt: hoursAgo(72) });
  const dry = post({ id: 'dry', title: '속건조 수분크림', concernCategory: 'dryness', createdAt: hoursAgo(2) });
  const base = post({ id: 'base', title: '쿠션 파운데이션 추천', concernCategory: 'texture', createdAt: hoursAgo(1) });
  const posts = [base, dry, eye];

  it('설정하지 않으면 원래 순서를 그대로 둔다', () => {
    const r = rankPosts(posts, {}, NOW);
    expect(r.map((x) => x.post.id)).toEqual(['base', 'dry', 'eye']);
    expect(hasFeedPreference({})).toBe(false);
  });

  it('모두 보통(1)으로 두어도 순서를 바꾸지 않는다', () => {
    const r = rankPosts(posts, { 'eye-makeup': 1, hydration: 1 }, NOW);
    expect(r.map((x) => x.post.id)).toEqual(['base', 'dry', 'eye']);
  });

  it('우선 보기로 고른 분야의 글이 오래된 글이어도 위로 올라온다', () => {
    const r = rankPosts(posts, { 'eye-makeup': 2 }, NOW);
    expect(r[0].post.id).toBe('eye');
    expect(r[0].reason).toContain('아이 메이크업');
    expect(r[1].reason).toBeNull();
  });

  it('안 보기로 고른 분야의 글은 목록에서 빠진다', () => {
    const r = rankPosts(posts, { 'base-makeup': 0 }, NOW);
    expect(r.map((x) => x.post.id)).not.toContain('base');
    expect(r).toHaveLength(2);
  });

  it('다른 분야에도 걸리는 글은 하나를 숨겨도 남는다', () => {
    const both = post({ id: 'both', title: '아이섀도 바르기 전 수분크림', concernCategory: 'dryness' });
    const r = rankPosts([both], { 'eye-makeup': 0 }, NOW);
    expect(r).toHaveLength(1);
  });

  it('우선 분야가 여러 개 걸린 글이 가장 위로 간다', () => {
    const one = post({ id: 'one', title: '아이라인', concernCategory: 'texture' });
    const two = post({ id: 'two', title: '아이라인 그리기 전 수분크림', concernCategory: 'dryness' });
    const r = rankPosts([one, two], { 'eye-makeup': 2, hydration: 2 }, NOW);
    expect(r[0].post.id).toBe('two');
    expect(r[0].matchedPriority).toHaveLength(2);
  });

  it('설정 요약을 한 줄로 만든다', () => {
    expect(feedSummary(null)).toContain('설정하지');
    expect(feedSummary({ hydration: 1 })).toContain('똑같이');
    expect(feedSummary({ hydration: 2, 'eye-makeup': 0 })).toBe('우선 1개 · 숨김 1개');
  });
});
