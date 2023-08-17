CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE exchanges(
    id uuid default uuid_generate_v4 ()  ,
    phase varchar NOT NULL ,
    signupMessageId varchar NOT NULL ,
    guildId varchar NOT NULL ,
    channelId varchar NOT NULL ,
    exchangeName varchar NOT NULL ,

    exchangeEndDate timestamp,
    exchangeReminderDate timestamp,

    exchangeEnded boolean,
    reminderSent boolean,
    primary key (id)
);

CREATE TABLE players(
   id uuid default uuid_generate_v4 () ,
   serverNickname varchar NOT NULL,
   toString varchar NOT NULL,
   drawnPlayerNickname varchar NOT NULL,
   tag varchar NOT NULL,
   exchangeId uuid NOT NULL references exchanges,
   primary key (id),
   constraint fk_exchange
                   foreign key (exchangeId)
                   references exchanges(id)

)