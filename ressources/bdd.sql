-- ============================================================
-- NIGHTR – Schéma PostgreSQL / Supabase (version corrigée)
-- ============================================================

-- -------------------------------------------------------
-- USERS
-- -------------------------------------------------------
CREATE TABLE users (
    user_id         UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    role            VARCHAR(20)     NOT NULL DEFAULT 'user'
                        CHECK (role IN ('user', 'business', 'admin')),
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    username        VARCHAR(50)     NOT NULL UNIQUE,
    avatar_url      TEXT,
    is_premium      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- CATEGORIES
-- Couvre : bar, restaurant, boîte de nuit, concert, événement
-- -------------------------------------------------------
CREATE TABLE categories (
    category_id     UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    type            VARCHAR(50)     NOT NULL
                        CHECK (type IN ('bar', 'restaurant', 'club', 'concert', 'event', 'other')),
    icon_url        TEXT
);

-- -------------------------------------------------------
-- CITIES
-- -------------------------------------------------------
CREATE TABLE cities (
    city_id         UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    country         VARCHAR(100)    NOT NULL,
    latitude        DECIMAL(10,7)   NOT NULL,
    longitude       DECIMAL(10,7)   NOT NULL,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE
);

-- -------------------------------------------------------
-- PLANS  (Basic / Pro / Premium)
-- -------------------------------------------------------
CREATE TABLE plans (
    plan_id         UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    name            VARCHAR(50)     NOT NULL UNIQUE
                        CHECK (name IN ('Basic', 'Pro', 'Premium')),
    price           NUMERIC(10,2)   NOT NULL,   -- prix mensuel en €
    features        TEXT            NOT NULL    -- liste JSON ou description des fonctionnalités
);

-- -------------------------------------------------------
-- SUBSCRIPTIONS
-- -------------------------------------------------------
CREATE TABLE subscriptions (
    subscription_id UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    start_date      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    end_date        TIMESTAMPTZ,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    plan_id         UUID            NOT NULL REFERENCES plans(plan_id)
);

-- -------------------------------------------------------
-- ESTABLISHMENTS
-- Champ ambiance ajouté pour les filtres du CDC
-- -------------------------------------------------------
CREATE TABLE establishments (
    establishment_id    UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    name                VARCHAR(255)    NOT NULL,
    description         TEXT,
    address             VARCHAR(255)    NOT NULL,
    latitude            DECIMAL(10,7)   NOT NULL,
    longitude           DECIMAL(10,7)   NOT NULL,
    phone               VARCHAR(20),
    website             TEXT,
    instagram           VARCHAR(100),
    ambiance            VARCHAR(100),   -- ex : "festif", "lounge", "chill", "électro"…
    click_count         INT             NOT NULL DEFAULT 0,  -- typo "clic" corrigée
    view_count          INT             NOT NULL DEFAULT 0,
    is_validated        BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    user_id             UUID            NOT NULL REFERENCES users(user_id),
    category_id         UUID            NOT NULL REFERENCES categories(category_id),
    subscription_id     UUID            NOT NULL REFERENCES subscriptions(subscription_id),
    city_id             UUID            NOT NULL REFERENCES cities(city_id)
);

-- -------------------------------------------------------
-- OPENING_HOURS
-- 1 ligne par jour (0 = dimanche … 6 = samedi)
-- -------------------------------------------------------
CREATE TABLE opening_hours (
    hours_id            UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    day_of_week         SMALLINT        NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    open_time           TIME            NOT NULL,
    close_time          TIME            NOT NULL,
    is_closed           BOOLEAN         NOT NULL DEFAULT FALSE,
    establishment_id    UUID            NOT NULL
                            REFERENCES establishments(establishment_id) ON DELETE CASCADE,
    UNIQUE (establishment_id, day_of_week)
);

-- -------------------------------------------------------
-- EVENTS
-- updated_at ajouté (absent dans v1)
-- -------------------------------------------------------
CREATE TABLE events (
    event_id            UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    title               VARCHAR(255)    NOT NULL,
    description         TEXT,
    start_datetime      TIMESTAMPTZ     NOT NULL,
    end_datetime        TIMESTAMPTZ,
    type                VARCHAR(50),    -- ex : "soirée", "concert", "happy hour", "festival"
    price_min           NUMERIC(10,2),
    price_max           NUMERIC(10,2),
    booking_url         TEXT,
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    establishment_id    UUID            NOT NULL
                            REFERENCES establishments(establishment_id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- PHOTOS
-- Polymorphique : lie une photo à un établissement ou un événement
-- is_cover : photo principale de la fiche
-- -------------------------------------------------------
CREATE TABLE photos (
    photo_id        UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    url             TEXT            NOT NULL,
    entity_type     VARCHAR(50)     NOT NULL CHECK (entity_type IN ('establishment', 'event')),
    entity_id       UUID            NOT NULL,   -- référence polymorphique (pas de FK native)
    is_cover        BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- REVIEWS
-- Contraintes CHECK et UNIQUE ajoutées
-- -------------------------------------------------------
CREATE TABLE reviews (
    review_id           UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    rating              SMALLINT        NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment             TEXT,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    establishment_id    UUID            NOT NULL
                            REFERENCES establishments(establishment_id) ON DELETE CASCADE,
    user_id             UUID            NOT NULL REFERENCES users(user_id),
    UNIQUE (establishment_id, user_id)  -- 1 avis par utilisateur par établissement
);

-- -------------------------------------------------------
-- FAVORITES
-- Contrainte UNIQUE ajoutée pour éviter les doublons
-- -------------------------------------------------------
CREATE TABLE favorites (
    favorite_id         UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    user_id             UUID            NOT NULL REFERENCES users(user_id),
    establishment_id    UUID            NOT NULL
                            REFERENCES establishments(establishment_id) ON DELETE CASCADE,
    UNIQUE (user_id, establishment_id)
);

-- -------------------------------------------------------
-- NOTIFICATIONS
-- entity_type/entity_id ajoutés pour lier la notif à son sujet
-- -------------------------------------------------------
CREATE TABLE notifications (
    notification_id UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    title           VARCHAR(255)    NOT NULL,
    body            TEXT            NOT NULL,
    type            VARCHAR(50)     NOT NULL
                        CHECK (type IN ('event', 'promo', 'system', 'review', 'favorite')),
    is_read         BOOLEAN         NOT NULL DEFAULT FALSE,
    entity_type     VARCHAR(50)             -- optionnel : 'event', 'establishment'…
                        CHECK (entity_type IN ('event', 'establishment', NULL)),
    entity_id       UUID,                   -- id de l'entité concernée
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    user_id         UUID            NOT NULL REFERENCES users(user_id)
);

-- -------------------------------------------------------
-- REPORTS
-- Refonte : reporter_id clair + entity_type/entity_id
-- pour signaler établissement, événement, avis ou utilisateur
-- -------------------------------------------------------
CREATE TABLE reports (
    report_id       UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    reason          TEXT            NOT NULL,
    entity_type     VARCHAR(50)     NOT NULL
                        CHECK (entity_type IN ('establishment', 'event', 'review', 'user')),
    entity_id       UUID            NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'reviewed', 'resolved')),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    reporter_id     UUID            NOT NULL REFERENCES users(user_id)
);

-- ============================================================
-- INDEX utiles pour les performances
-- ============================================================

CREATE INDEX idx_establishments_city     ON establishments(city_id);
CREATE INDEX idx_establishments_category ON establishments(category_id);
CREATE INDEX idx_establishments_location ON establishments(latitude, longitude);
CREATE INDEX idx_events_start            ON events(start_datetime);
CREATE INDEX idx_events_establishment    ON events(establishment_id);
CREATE INDEX idx_reviews_establishment   ON reviews(establishment_id);
CREATE INDEX idx_notifications_user      ON notifications(user_id, is_read);
CREATE INDEX idx_photos_entity           ON photos(entity_type, entity_id);