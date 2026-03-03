-- =============================================================
-- Migration: 00002_community_platform.sql
-- Phase 3: Auth profiles, Forum, Mutual Aid, Event RSVPs
-- =============================================================

-- -----------------------------------------------
-- 1. PROFILES (linked to Supabase Auth users)
-- -----------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  neighborhood TEXT DEFAULT '',
  interests TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{"en"}',
  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('member', 'moderator', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile row on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, languages)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      'Community Member'
    ),
    ARRAY[COALESCE(NEW.raw_user_meta_data->>'preferred_locale', 'en')]
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Shared updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- -----------------------------------------------
-- 2. FORUM CATEGORIES
-- -----------------------------------------------
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL,
  description JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forum categories are publicly readable"
  ON forum_categories FOR SELECT USING (true);

-- Seed the 8 categories (multilingual JSONB)
INSERT INTO forum_categories (slug, name, description, sort_order, icon) VALUES
  ('announcements',
   '{"en":"Announcements","es":"Anuncios","vi":"Thông báo","zh":"公告","ru":"Объявления"}'::jsonb,
   '{"en":"Official updates from Gateway Confluence","es":"Actualizaciones oficiales de Gateway Confluence","vi":"Cập nhật chính thức từ Gateway Confluence","zh":"Gateway Confluence官方更新","ru":"Официальные обновления Gateway Confluence"}'::jsonb,
   0, 'megaphone'),
  ('housing-neighbors',
   '{"en":"Housing & Neighbors","es":"Vivienda y Vecinos","vi":"Nhà ở & Hàng Xóm","zh":"住房与邻里","ru":"Жильё и соседи"}'::jsonb,
   '{"en":"Discuss housing issues, tenant rights, and neighborhood matters","es":"Discuta temas de vivienda, derechos de inquilinos y asuntos del vecindario","vi":"Thảo luận về vấn đề nhà ở, quyền người thuê và việc khu phố","zh":"讨论住房问题、租户权利和社区事务","ru":"Обсудите жилищные вопросы, права арендаторов и дела соседей"}'::jsonb,
   1, 'home'),
  ('small-business',
   '{"en":"Small Business Support","es":"Apoyo a Pequeños Negocios","vi":"Hỗ trợ Doanh nghiệp nhỏ","zh":"小企业支持","ru":"Поддержка малого бизнеса"}'::jsonb,
   '{"en":"Resources and discussion for Gateway small business owners","es":"Recursos y discusión para dueños de pequeños negocios de Gateway","vi":"Tài nguyên và thảo luận cho doanh nghiệp nhỏ Gateway","zh":"Gateway小企业主的资源和讨论","ru":"Ресурсы и обсуждения для малого бизнеса Gateway"}'::jsonb,
   2, 'store'),
  ('public-spaces',
   '{"en":"Public Spaces","es":"Espacios Públicos","vi":"Không gian Công cộng","zh":"公共空间","ru":"Общественные пространства"}'::jsonb,
   '{"en":"Parks, plazas, and shared spaces in Gateway","es":"Parques, plazas y espacios compartidos en Gateway","vi":"Công viên, quảng trường và không gian chung tại Gateway","zh":"Gateway的公园、广场和共享空间","ru":"Парки, площади и общие пространства Gateway"}'::jsonb,
   3, 'trees'),
  ('safety-wellness',
   '{"en":"Safety & Wellness","es":"Seguridad y Bienestar","vi":"An toàn & Sức khỏe","zh":"安全与健康","ru":"Безопасность и здоровье"}'::jsonb,
   '{"en":"Community safety, health resources, and wellness","es":"Seguridad comunitaria, recursos de salud y bienestar","vi":"An toàn cộng đồng, tài nguyên sức khỏe","zh":"社区安全、健康资源和福祉","ru":"Общественная безопасность, ресурсы здоровья"}'::jsonb,
   4, 'shield'),
  ('events-culture',
   '{"en":"Events & Culture","es":"Eventos y Cultura","vi":"Sự kiện & Văn hóa","zh":"活动与文化","ru":"События и культура"}'::jsonb,
   '{"en":"Cultural events, festivals, and community gatherings","es":"Eventos culturales, festivales y reuniones comunitarias","vi":"Sự kiện văn hóa, lễ hội và họp mặt cộng đồng","zh":"文化活动、节日和社区聚会","ru":"Культурные события, фестивали и общественные встречи"}'::jsonb,
   5, 'calendar'),
  ('youth-families',
   '{"en":"Youth & Families","es":"Jóvenes y Familias","vi":"Thanh thiếu niên & Gia đình","zh":"青少年与家庭","ru":"Молодёжь и семьи"}'::jsonb,
   '{"en":"Resources, activities, and support for young people and families","es":"Recursos, actividades y apoyo para jóvenes y familias","vi":"Tài nguyên, hoạt động và hỗ trợ cho thanh niên và gia đình","zh":"青少年和家庭的资源、活动和支持","ru":"Ресурсы, мероприятия и поддержка для молодёжи и семей"}'::jsonb,
   6, 'users'),
  ('general',
   '{"en":"General Discussion","es":"Discusión General","vi":"Thảo luận Chung","zh":"综合讨论","ru":"Общее обсуждение"}'::jsonb,
   '{"en":"Open discussion about anything related to Gateway","es":"Discusión abierta sobre cualquier tema relacionado con Gateway","vi":"Thảo luận mở về mọi thứ liên quan đến Gateway","zh":"关于Gateway的开放讨论","ru":"Открытое обсуждение обо всём, что связано с Gateway"}'::jsonb,
   7, 'message-circle');

-- -----------------------------------------------
-- 3. FORUM TOPICS
-- -----------------------------------------------
CREATE TABLE forum_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  reply_count INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_forum_topics_category ON forum_topics(category_id, last_activity_at DESC);
CREATE INDEX idx_forum_topics_author ON forum_topics(author_id);

ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forum topics are publicly readable"
  ON forum_topics FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create topics"
  ON forum_topics FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own topics"
  ON forum_topics FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own topics"
  ON forum_topics FOR DELETE USING (auth.uid() = author_id);

CREATE TRIGGER forum_topics_updated_at
  BEFORE UPDATE ON forum_topics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- -----------------------------------------------
-- 4. FORUM REPLIES
-- -----------------------------------------------
CREATE TABLE forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_forum_replies_topic ON forum_replies(topic_id, created_at ASC);
CREATE INDEX idx_forum_replies_parent ON forum_replies(parent_id);

ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forum replies are publicly readable"
  ON forum_replies FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own replies"
  ON forum_replies FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own replies"
  ON forum_replies FOR DELETE USING (auth.uid() = author_id);

CREATE TRIGGER forum_replies_updated_at
  BEFORE UPDATE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Increment/decrement reply count on topic
CREATE OR REPLACE FUNCTION public.update_topic_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_topics
    SET reply_count = reply_count + 1, last_activity_at = now()
    WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_topics
    SET reply_count = GREATEST(reply_count - 1, 0)
    WHERE id = OLD.topic_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_forum_reply_change
  AFTER INSERT OR DELETE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_topic_reply_count();

-- -----------------------------------------------
-- 5. MUTUAL AID BOARD
-- -----------------------------------------------
CREATE TABLE mutual_aid_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('offer', 'request')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'fulfilled', 'closed')),
  language TEXT DEFAULT 'en',
  contact_method TEXT,
  response_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_mutual_aid_status ON mutual_aid_posts(status, created_at DESC);
CREATE INDEX idx_mutual_aid_type ON mutual_aid_posts(type, status);
CREATE INDEX idx_mutual_aid_author ON mutual_aid_posts(author_id);

ALTER TABLE mutual_aid_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mutual aid posts are publicly readable"
  ON mutual_aid_posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create mutual aid posts"
  ON mutual_aid_posts FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own mutual aid posts"
  ON mutual_aid_posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own mutual aid posts"
  ON mutual_aid_posts FOR DELETE USING (auth.uid() = author_id);

CREATE TRIGGER mutual_aid_posts_updated_at
  BEFORE UPDATE ON mutual_aid_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- -----------------------------------------------
-- 6. MUTUAL AID RESPONSES
-- -----------------------------------------------
CREATE TABLE mutual_aid_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES mutual_aid_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_mutual_aid_responses_post ON mutual_aid_responses(post_id, created_at ASC);

ALTER TABLE mutual_aid_responses ENABLE ROW LEVEL SECURITY;

-- Responses visible to post author and response author only
CREATE POLICY "Response authors and post owners can view responses"
  ON mutual_aid_responses FOR SELECT
  USING (
    auth.uid() = author_id
    OR auth.uid() = (SELECT author_id FROM mutual_aid_posts WHERE id = post_id)
  );

CREATE POLICY "Authenticated users can create responses"
  ON mutual_aid_responses FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Increment response count
CREATE OR REPLACE FUNCTION public.update_aid_response_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE mutual_aid_posts SET response_count = response_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE mutual_aid_posts SET response_count = GREATEST(response_count - 1, 0)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_aid_response_change
  AFTER INSERT OR DELETE ON mutual_aid_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_aid_response_count();

-- -----------------------------------------------
-- 7. EVENT RSVPs
-- -----------------------------------------------
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('going', 'maybe', 'not_going')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_rsvps_event ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_user ON event_rsvps(user_id);

ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RSVPs are publicly readable"
  ON event_rsvps FOR SELECT USING (true);

CREATE POLICY "Authenticated users can RSVP"
  ON event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own RSVP"
  ON event_rsvps FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own RSVP"
  ON event_rsvps FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER event_rsvps_updated_at
  BEFORE UPDATE ON event_rsvps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- -----------------------------------------------
-- 8. MODERATOR POLICIES
-- -----------------------------------------------
CREATE POLICY "Moderators can update any topic"
  ON forum_topics FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin')));

CREATE POLICY "Moderators can delete any topic"
  ON forum_topics FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin')));

CREATE POLICY "Moderators can update any reply"
  ON forum_replies FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin')));

CREATE POLICY "Moderators can delete any reply"
  ON forum_replies FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin')));

CREATE POLICY "Moderators can update any mutual aid post"
  ON mutual_aid_posts FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin')));

-- -----------------------------------------------
-- 9. ENABLE REALTIME
-- -----------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE mutual_aid_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE forum_replies;
