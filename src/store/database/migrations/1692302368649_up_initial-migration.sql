CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE exchanges(
    id uuid default uuid_generate_v4 ()  ,
    phase varchar NOT NULL ,
    signup_message_id varchar NOT NULL ,
    guild_id varchar NOT NULL ,
    channel_id varchar NOT NULL ,
    exchange_name varchar NOT NULL ,

    exchange_end_date timestamp,
    exchange_reminder_date timestamp,

    exchange_ended boolean,
    reminder_sent boolean,
    primary key (id)
);

CREATE TABLE players(
   id uuid default uuid_generate_v4 () ,
   server_nickname varchar NOT NULL,
   to_string varchar NOT NULL,
   tag varchar NOT NULL,
   exchange_id uuid NOT NULL references exchanges,
   discord_id varchar NOT NULL ,

   drawn_player_nickname varchar,
   primary key (id),
   constraint fk_exchange
                   foreign key (exchange_id)
                   references exchanges(id)

)