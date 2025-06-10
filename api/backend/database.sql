CREATE TABLE ticket_tier (
  id NUMBER PRIMARY KEY,
  tier_name VARCHAR2(128),
  base_price NUMBER,
  entry_allowed_from TIMESTAMP,
  entry_allowed_to TIMESTAMP,
  single_use NUMBER(1),
  single_daily NUMBER(1),
  tier_pdf_template_irid VARCHAR2(64),
  tier_mail_template_irid VARCHAR2(64),
  stock_initial NUMBER,
  stock_current NUMBER,
  stock_sold NUMBER,
  event NUMBER
);

CREATE TABLE ticket_bought (
  user_run VARCHAR2(12),
  tier_id NUMBER,
  bought_at TIMESTAMP,
  ticket_status VARCHAR2(64)
);

CREATE TABLE calendar_event (
  id NUMBER PRIMARY KEY,
  internal_event_id NUMBER,
  logo_irid VARCHAR2(64),
  date_start TIMESTAMP,
  date_end TIMESTAMP
);

CREATE TABLE event (
  id NUMBER PRIMARY KEY,
  slug VARCHAR2(12),
  event_name VARCHAR2(128),
  event_description VARCHAR2(512),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  logo_irid VARCHAR2(64),
  banner_irid VARCHAR2(64),
  template_irid VARCHAR2(64),
  css_irid VARCHAR2(64),
  public NUMBER(1),
  company NUMBER
);

CREATE TABLE company (
  id NUMBER PRIMARY KEY,
  company_name VARCHAR2(256),
  company_run VARCHAR2(12),
  logo_irid VARCHAR2(64),
  banner_irid VARCHAR2(64),
  html_irid VARCHAR2(64),
  contact_rut VARCHAR2(12),
  contact_name VARCHAR2(128),
  contact_surname VARCHAR2(128),
  contact_email VARCHAR2(512),
  contact_phone VARCHAR2(12),
  contact_dir_states NUMBER(4),
  contact_dir_county NUMBER(4),
  contact_dir_street_1 VARCHAR2(128),
  contact_dir_street_2 VARCHAR2(128),
  contact_dir_st_number VARCHAR2(16),
  contact_dir_in_number VARCHAR2(16)
);

CREATE TABLE "user" (
  run VARCHAR2(12) PRIMARY KEY,
  first_names VARCHAR2(128),
  last_names VARCHAR2(128),
  email VARCHAR2(512),
  phone VARCHAR2(12),
  dir_states NUMBER(4),
  dir_county NUMBER(4),
  dir_street_1 VARCHAR2(128),
  dir_street_2 VARCHAR2(128),
  dir_st_number VARCHAR2(16),
  dir_in_number VARCHAR2(16),
  notify NUMBER(1)
);

CREATE TABLE user_admin_company (
  user_run VARCHAR2(12),
  company NUMBER
);

CREATE TABLE user_mod_company (
  user_run VARCHAR2(12),
  company NUMBER
);

CREATE TABLE analytics_session (
  id VARCHAR2(64) PRIMARY KEY,
  user_run VARCHAR2(12),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  ip_address VARCHAR2(64),
  user_agent VARCHAR2(256)
);

CREATE TABLE analytics_event (
  id NUMBER PRIMARY KEY,
  session_id VARCHAR2(64),
  event_name VARCHAR2(128),
  metadata VARCHAR2(2048),
  occurred_at TIMESTAMP
);

CREATE TABLE coupon (
  id NUMBER PRIMARY KEY,
  code VARCHAR2(64) UNIQUE,
  description VARCHAR2(256),
  discount_type VARCHAR2(32),
  discount_value NUMBER,
  usage_limit NUMBER,
  usage_count NUMBER,
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  event_id NUMBER,
  active NUMBER(1)
);

CREATE TABLE coupon_usage (
  id NUMBER PRIMARY KEY,
  coupon_id NUMBER,
  ticket_order_id NUMBER,
  ticket_id NUMBER,
  used_at TIMESTAMP
);

CREATE TABLE ticket_order (
  id NUMBER PRIMARY KEY,
  user_run VARCHAR2(12),
  order_date TIMESTAMP,
  total_amount NUMBER,
  status VARCHAR2(32),
  payment_method VARCHAR2(32),
  payment_reference VARCHAR2(128)
);

CREATE TABLE ticket_order_item (
  id NUMBER PRIMARY KEY,
  order_id NUMBER,
  tier_id NUMBER,
  quantity NUMBER,
  price_per_ticket NUMBER
);

-- Foreign Key Constraints
ALTER TABLE ticket_order_item ADD CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES ticket_order (id);
ALTER TABLE ticket_order_item ADD CONSTRAINT fk_order_item_tier FOREIGN KEY (tier_id) REFERENCES ticket_tier (id);
ALTER TABLE ticket_order ADD CONSTRAINT fk_ticket_order_user FOREIGN KEY (user_run) REFERENCES "user" (run);
ALTER TABLE coupon_usage ADD CONSTRAINT fk_coupon_usage_coupon FOREIGN KEY (coupon_id) REFERENCES coupon (id);
ALTER TABLE coupon_usage ADD CONSTRAINT fk_coupon_usage_order FOREIGN KEY (ticket_order_id) REFERENCES ticket_order (id);
ALTER TABLE coupon ADD CONSTRAINT fk_coupon_event FOREIGN KEY (event_id) REFERENCES event (id);
ALTER TABLE analytics_event ADD CONSTRAINT fk_event_session FOREIGN KEY (session_id) REFERENCES analytics_session (id);
ALTER TABLE analytics_session ADD CONSTRAINT fk_session_user FOREIGN KEY (user_run) REFERENCES "user" (run);
ALTER TABLE event ADD CONSTRAINT fk_event_calendar FOREIGN KEY (id) REFERENCES calendar_event (internal_event_id);
ALTER TABLE ticket_bought ADD CONSTRAINT fk_bought_user FOREIGN KEY (user_run) REFERENCES "user" (run);
ALTER TABLE ticket_bought ADD CONSTRAINT fk_bought_tier FOREIGN KEY (tier_id) REFERENCES ticket_tier (id);
ALTER TABLE event ADD CONSTRAINT fk_event_company FOREIGN KEY (company) REFERENCES company (id);
ALTER TABLE ticket_tier ADD CONSTRAINT fk_tier_event FOREIGN KEY (event) REFERENCES event (id);
ALTER TABLE user_admin_company ADD CONSTRAINT fk_admin_user FOREIGN KEY (user_run) REFERENCES "user" (run);
ALTER TABLE user_admin_company ADD CONSTRAINT fk_admin_company FOREIGN KEY (company) REFERENCES company (id);
ALTER TABLE user_mod_company ADD CONSTRAINT fk_mod_user FOREIGN KEY (user_run) REFERENCES "user" (run);
ALTER TABLE user_mod_company ADD CONSTRAINT fk_mod_company FOREIGN KEY (company) REFERENCES company (id);
