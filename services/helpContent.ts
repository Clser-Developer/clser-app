import { FAQ, HelpTopic } from '../types';

export const helpContent: { [key: string]: HelpTopic } = {
  novidades: {
    title: "Ajuda: Novidades",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
    faqs: [
      {
        question: "O que é a área 'Novidades'?",
        answer: "Aqui você encontra todas as publicações exclusivas do seu artista, como fotos, vídeos, enquetes e textos. É a timeline principal do Fã Clube."
      },
      {
        question: "Como interajo com as publicações?",
        answer: "Você pode curtir clicando no coração, comentar e, no caso de enquetes, votar na sua opção preferida. Cada interação te dá Fan Points!"
      },
      {
        question: "Posso filtrar o conteúdo?",
        answer: "Atualmente, a timeline é exibida em ordem cronológica para que você não perca nada. Recursos de filtro poderão ser adicionados no futuro."
      }
    ]
  },
  media: {
    title: "Ajuda: Mídia",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
    faqs: [
      {
        question: "Por que devo conectar minhas contas do YouTube/Spotify?",
        answer: "Ao conectar suas contas, cada play que você der dentro do app contará como uma view/stream oficial para o artista, ajudando-o nos charts! Além disso, você ganha Fan Points por conectar."
      },
      {
        question: "O app tem acesso aos meus dados?",
        answer: "O app apenas solicita a permissão para tocar mídias em seu nome. Não temos acesso a informações pessoais, playlists ou senhas."
      }
    ]
  },
  loja: {
    title: "Ajuda: Loja",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
    faqs: [
      {
        question: "Como funciona a loja?",
        answer: "A loja é o espaço para adquirir produtos oficiais, ingressos para shows, dar lances em leilões de itens raros e muito mais."
      },
      {
        question: "Como acompanho meus pedidos?",
        answer: "Na tela inicial da Loja, clique em 'Minhas Compras' para ver o histórico de todos os seus pedidos e o status de rastreamento de cada um."
      }
    ]
  },
  loja_merch: {
    title: "Ajuda: Loja de Merch",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
    faqs: [
      {
        question: "Como adiciono itens ao carrinho?",
        answer: "Basta clicar no botão 'Adicionar ao Carrinho' em qualquer produto. Você verá um ícone de carrinho flutuante aparecer no canto da tela."
      },
      {
        question: "Como finalizo minha compra?",
        answer: "Clique no ícone de carrinho flutuante para abrir a tela de finalização de compra. Lá você poderá revisar seu pedido e confirmar o pagamento."
      }
    ]
  },
  loja_tickets: {
    title: "Ajuda: Ingressos",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
    faqs: [
      {
        question: "Os ingressos são digitais?",
        answer: "Sim, após a compra, os ingressos digitais (com QR Code) ficarão disponíveis na área 'Minhas Compras' dentro da Loja."
      },
      {
        question: "Posso comprar ingressos para outras pessoas?",
        answer: "Sim, você pode comprar múltiplos ingressos, mas verifique as regras de cada evento sobre a necessidade de nomear os participantes."
      }
    ]
  },
   loja_auctions: {
    title: "Ajuda: Leilões",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
    faqs: [
      {
        question: "Como funcionam os lances?",
        answer: "Cada leilão tem um incremento mínimo. Seu lance deve ser o valor do lance atual mais o incremento. Se você for o maior lance ao final do tempo, você ganha!"
      },
      {
        question: "Dar um lance tem custo?",
        answer: "Dar um lance não tem custo, mas é um compromisso de compra. Você só paga se for o vencedor do leilão."
      }
    ]
  },
  loja_crowdfunding: {
    title: "Ajuda: Crowdfunding",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    faqs: [
      { question: "Como funciona o Crowdfunding?", answer: "Apoie projetos do seu artista, como a gravação de um clipe, e ganhe recompensas exclusivas pelo seu apoio." },
      { question: "Meu apoio tem retorno garantido?", answer: "Sim, se o projeto atingir a meta, você recebe sua recompensa. Caso contrário, o valor pode ser estornado (verifique as regras de cada projeto)." },
    ]
  },
  loja_experiences: {
    title: "Ajuda: Experiências",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    faqs: [
      { question: "Que tipo de experiências posso comprar?", answer: "Desde Meet & Greets virtuais, acesso a bastidores, até itens personalizados. As opções são únicas e limitadas!" },
    ]
  },
  loja_ppv: {
    title: "Ajuda: Pay-Per-View (PPV)",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    faqs: [
      { question: "Como assisto a um evento PPV?", answer: "Compre o acesso ao evento e assista à transmissão ao vivo diretamente aqui no app, na data e horário marcados." },
    ]
  },
  fan_area: {
    title: "Ajuda: Área do Fã",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
    faqs: [
      {
        question: "O que é a Área do Fã?",
        answer: "É o coração da comunidade! Um espaço para você interagir com outros fãs, participar de atividades, ver o ranking e muito mais."
      },
      {
        question: "As minhas publicações são moderadas?",
        answer: "Sim. Para garantir um ambiente seguro para todos, todo o conteúdo postado por fãs passa por uma moderação para evitar material inadequado."
      }
    ]
  },
  fan_area_mural: {
    title: "Ajuda: Mural de Fãs",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    faqs: [
        { question: "O que posso postar no mural?", answer: "Fotos e vídeos seus em shows, com merch do artista, ou qualquer momento especial que você queira compartilhar com a comunidade." },
        { question: "Existe moderação de conteúdo?", answer: "Sim, todo conteúdo passa por uma análise para garantir um ambiente seguro e positivo para todos os fãs." },
    ]
  },
  fan_area_leaderboard: {
      title: "Ajuda: Ranking de Fãs",
      videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      faqs: [
          { question: "Como funciona o Ranking?", answer: "O ranking mostra os fãs mais engajados com base nos Fan Points acumulados. Interaja no app para ganhar pontos e subir de posição!" },
          { question: "Para que serve o Ranking?", answer: "Sua posição no ranking pode te tornar elegível para sorteios e prêmios exclusivos. Quanto mais alta sua posição, mais chances de ganhar!" },
      ]
  },
  fan_area_rewards: {
      title: "Ajuda: Recompensas Exclusivas",
      videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      faqs: [
          { question: "O que são as Recompensas?", answer: "São prêmios, sorteios e ofertas especiais que ficam disponíveis com base no seu nível de fã ou posição no ranking. Quanto mais você interage, mais chances tem de se tornar elegível!" },
          { question: "Como sei se estou elegível?", answer: "Cada recompensa mostra os requisitos (pontos ou ranking) e se você os atende no momento. Interaja mais para melhorar suas chances!" },
      ]
  },
  fan_area_groups: {
      title: "Ajuda: Grupos de Fãs",
      videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      faqs: [
          { question: "Como funcionam os grupos?", answer: "Você pode criar ou se juntar a grupos baseados em interesses comuns, como sua cidade, para organizar caravanas para shows, ou tópicos de discussão específicos." },
      ]
  },
  fan_area_polls: {
      title: "Ajuda: Enquetes da Comunidade",
      videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      faqs: [
          { question: "Quem pode criar enquetes?", answer: "Todos os membros do fã clube podem criar enquetes para interagir com a comunidade e descobrir a opinião de outros fãs." },
      ]
  },
  fan_area_fan_art: {
      title: "Ajuda: Galeria de Fan Arts",
      videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      faqs: [
          { question: "Como envio minha arte?", answer: "Na seção da Galeria, haverá uma opção para você fazer o upload de seus desenhos, pinturas e artes digitais inspiradas no artista." },
      ]
  },
  profile: {
    title: "Ajuda: Perfil",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
    faqs: [
      {
        question: "Para que servem os 'Fan Points'?",
        answer: "Eles medem seu engajamento! Quanto mais você interage, mais pontos ganha, subindo de nível e melhorando sua posição no Ranking de Fãs para concorrer a prêmios."
      },
      {
        question: "Onde estão as Recompensas Exclusivas?",
        answer: "As recompensas foram movidas para a 'Área do Fã' para centralizar todas as atividades da comunidade. Dê uma olhada lá!"
      },
      {
        question: "Como vejo o ranking completo?",
        answer: "O ranking de fãs agora está na 'Área do Fã'. Lá você pode ver a sua posição em relação a outros membros do Fã Clube."
      }
    ]
  },
  geral: {
    title: "Ajuda Geral",
    videoTutorialUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
    faqs: [
      {
        question: "Como altero meu plano de assinatura?",
        answer: "No momento, a alteração de plano não está disponível diretamente no app. Para fazer upgrade ou downgrade, você precisa cancelar sua assinatura atual e assinar o novo plano desejado."
      },
      {
        question: "Onde vejo meu nível de fã e ranking?",
        answer: "Suas estatísticas, como Fan Points e nível de fã, estão em 'Perfil'. Já o ranking completo com outros fãs foi movido para a 'Área do Fã'."
      },
      {
        question: "O pagamento no app é seguro?",
        answer: "Sim! Todos os pagamentos são processados através de plataformas seguras e reconhecidas no mercado, utilizando criptografia para proteger seus dados."
      },
      {
        question: "Posso cancelar minha assinatura a qualquer momento?",
        answer: "Sim, você pode cancelar sua assinatura quando quiser. Você continuará com acesso aos benefícios do seu plano até o final do período de faturamento já pago."
      },
      {
        question: "Não encontrei minha dúvida aqui. O que faço?",
        answer: "Se sua dúvida não foi respondida, por favor, entre em contato com nosso suporte através do email ajuda@superfans.app."
      },
      {
        question: "Como posso sugerir uma nova funcionalidade?",
        answer: "Adoramos ouvir nossos usuários! Envie suas sugestões para o email sugestoes@superfans.app e nossa equipe irá analisar."
      }
    ]
  }
};


// Create a flattened list of all FAQs for searching
const createAllFaqs = (): (FAQ & { category: string })[] => {
  const faqs: (FAQ & { category: string })[] = [];
  for (const key in helpContent) {
    const topic = helpContent[key];
    topic.faqs.forEach(faq => {
      faqs.push({
        ...faq,
        category: topic.title.replace('Ajuda: ', '')
      });
    });
  }
  // Remove duplicates by question, just in case
  return faqs.filter((faq, index, self) =>
    index === self.findIndex((f) => (
      f.question === faq.question
    ))
  );
};

export const allFaqs = createAllFaqs();