type PresetRole = "ICH" | "KIND" | "ANKLAEGER" | "JESUS" | "COPING";

type PresetEntry = {
  id: string;
  role: PresetRole;
  text: string;
};

type PresetConfig = {
  label: string;
  entries: PresetEntry[];
};

export const presetDialogues: Record<string, PresetConfig> = {
  angst: {
    label: "Angst & Sicherheit",
    entries: [
      {
        id: "angst-1",
        role: "ANKLAEGER",
        text:
          "Schon wieder hast du Angst. In der Bibel steht doch: »Fürchte dich nicht!« Du hast zu wenig gekämpft und zu wenig geglaubt. Diese Angst sollte längst verschwunden sein.",
      },
      {
        id: "angst-2",
        role: "KIND",
        text:
          "Ja … ich spüre die Angst. Es fühlt sich an, als würde mir der Boden unter den Füßen weggezogen und ich bin verlassen. Ich sehne mich so sehr nach Geborgenheit, nach einem Ort, an dem ich geschützt bin.",
      },
      {
        id: "angst-3",
        role: "ANKLAEGER",
        text:
          "Du bist viel zu schwach im Glauben. Mit so viel Angst kannst du Gott nicht gefallen. Du müsstest stärker sein, sonst hat Gott kein Wohlgefallen an dir.",
      },
      {
        id: "angst-4",
        role: "KIND",
        text:
          "Dann wird es wohl stimmen … und ich schäme mich. Aber tief in mir weiß ich, dass ich Sicherheit brauche. Als Kind habe ich sie oft nicht bekommen. Jetzt merke ich, wie verletzlich ich bin.",
      },
      {
        id: "angst-5",
        role: "JESUS",
        text:
          "Ich verurteile dich nicht. Ich kenne deine Sehnsucht nach Sicherheit. Dieses Bedürfnis ist gut – ich habe es dir gegeben. Ich selbst will deine Sicherheit sein; das ist Gnade zur rechten Zeit.",
      },
      {
        id: "angst-6",
        role: "KIND",
        text:
          "Du sagst, dass du mir Sicherheit gibst … und doch spüre ich die Angst immer noch. Sie verschwindet nicht sofort. Darf ich trotzdem bei dir bleiben, so schwach wie ich bin?",
      },
      {
        id: "angst-7",
        role: "JESUS",
        text:
          "Ja. Du darfst die Angst fühlen und gleichzeitig in mir sicher sein. Auch wenn du dich noch fürchtest, bist du sicher in meinen Armen. Mit der Zeit wirst du erleben: Meine Stütze trägt dich wirklich. Dein Herz lernt langsam, Schritt für Schritt, dass ich dich festhalte.",
      },
      {
        id: "angst-8",
        role: "KIND",
        text:
          "Die Angst muss also gar nicht sofort verschwinden? Ich kann mich fürchten und trotzdem bei dir sicher sein? Wenn ich das immer wieder erfahre, wächst das Vertrauen – selbst wenn ich noch schwach bin?",
      },
      {
        id: "angst-9",
        role: "JESUS",
        text:
          "Genau. Dein Bedürfnis nach Sicherheit wird gestillt, nicht verdrängt. Jedes Mal, wenn du mit deiner Angst zu mir kommst, wächst das Vertrauen und du wirst verwandelt. So verliert die Angst ihre Macht – nicht weil sie sofort verschwindet, sondern weil du lernst, in mir sicher zu sein, auch während sie noch da ist. Erinnerst du dich an Paulus? Er bat, dass der Bote Satans weggenommen werde. Ich sagte zu ihm: Meine Gnade genügt dir. Danach konnte Paulus sich sogar über seine Schwachheit freuen, denn dann konnte meine Sicherheit noch stärker wirken.",
      },
      {
        id: "angst-10",
        role: "KIND",
        text:
          "Es ist neu für mich, dass ich mich sogar über die Angst freuen kann und nicht kämpfen muss, um sie loszuwerden. Aber Johan Oskar Smith singt ja auch, dass Leiden süß sind. Das habe ich vorher nie verstanden.",
      },
    ],
  },
  allgemein: {
    label: "Allgemeines Beispiel",
    entries: [
      {
        id: "general-1",
        role: "JESUS",
        text:
          "Ich bin bei dir. Deine Schwachheit schreckt mich nicht. Lass mich deine Angst tragen – Schritt für Schritt.",
      },
      {
        id: "general-2",
        role: "ANKLAEGER",
        text:
          "Reiß dich zusammen! Du solltest längst stärker sein. Niemand kann ständig Rücksicht auf deine Schwäche nehmen.",
      },
      {
        id: "general-3",
        role: "KIND",
        text:
          "In mir ist so viel Unsicherheit. Ich möchte, dass jemand bei mir bleibt und mich hält, auch wenn ich Angst habe.",
      },
      {
        id: "general-4",
        role: "ICH",
        text:
          "Ich sehe euch beide: Ankläger, du willst schützen, doch deine Strenge verletzt. Kind, deine Sehnsucht ist echt – du brauchst Trost und Verlässlichkeit.",
      },
      {
        id: "general-5",
        role: "COPING",
        text:
          "Ich könnte mich zurückziehen oder mich ablenken, bis die Anspannung nachlässt. Das hat früher geholfen, auch wenn es nichts löst.",
      },
      {
        id: "general-6",
        role: "JESUS",
        text:
          "Ich kenne deine Bewältigungsstrategien. Sie waren wichtig, um durchzuhalten. Jetzt lade ich dich ein, dich auf mich zu stützen.",
      },
      {
        id: "general-7",
        role: "KIND",
        text:
          "Wenn du wirklich bleibst, Jesus, wage ich mich Schritt für Schritt vor. Ich möchte lernen, Sicherheit bei dir zu erleben.",
      },
      {
        id: "general-8",
        role: "ICH",
        text:
          "Wir bleiben bei der Angst und halten sie gemeinsam aus. Ich begleite euch als Erwachsener und lade Jesus in jeden Schritt ein.",
      },
      {
        id: "general-9",
        role: "ANKLAEGER",
        text:
          "Vielleicht kann ich lernen, nicht zu strafen, sondern zu warnen – und dabei Raum für Trost zu lassen.",
      },
      {
        id: "general-10",
        role: "JESUS",
        text:
          "Hier, mitten in eurer Unsicherheit, halte ich euch zusammen. Meine Liebe vertieft eure Sicherheit, auch wenn die Angst nur langsam weicht.",
      },
    ],
  },
};

export type PresetKey = keyof typeof presetDialogues;
