// =============================================================================
// actual-test-data.js — Full passage + Cambridge IELTS 19 · Test 3 · Passage 2
// =============================================================================
//
// QUESTION TYPES:
//   'match-para'   → select paragraph A–H for each statement
//   'sentence'     → fill ONE WORD in each sentence blank
//   'match-expert' → match statement to expert A–D
// =============================================================================

const ACTUAL_TEST = {

  title: "The Global Importance of Wetlands",
  subtitle: "Cambridge IELTS 19 – Test 3 · Reading Passage 2",

  // ── Full passage (8 paragraphs) ────────────────────────────────────────────
  paragraphs: [
    {
      label: 'A',
      text: "Wetlands are areas where water covers the soil, or is present either at or near the surface of the soil, for all or part of the year. These are complex ecosystems, rich in unique plant and animal life. But according to the World Wide Fund for Nature (WWFN), half of the world\u2019s wetlands have disappeared since 1990 \u2013 converted or destroyed for commercial development, drainage schemes and the extraction of minerals and peat. Many of those that remain have been damaged by agricultural pesticides and fertilizers, industrial pollutants, and construction works."
    },
    {
      label: 'B',
      text: "Throughout history, humans have gathered around wetlands, and their fertile ecosystems have played an important part in human development. Consequently, they are of considerable religious, historical and archaeological value to many communities around the world. \u2018Wetlands directly support the livelihoods and well-being of millions of people,\u2019 says Dr Matthew McCartney, principal researcher and hydrologist at the International Water Management Institute (IWMI). \u2018In many developing countries, large numbers of people are dependent on wetland agriculture for their livelihoods.\u2019"
    },
    {
      label: 'C',
      text: "They also serve a crucial environmental purpose. \u2018Wetlands are one of the key tools in mitigating climate change across the planet,\u2019 says Pieter van Eijk, head of Climate Adaptation at Wetlands International (WI), pointing to their use as buffers that protect coastal areas from sea-level rise and extreme weather events such as hurricanes and flooding. Wetland coastal forests provide food and water, as well as shelter from storms, and WI and other agencies are working to restore those forests which have been lost. \u2018It can be as simple as planting a few trees per hectare to create shade and substantially change a microclimate,\u2019 he says. \u2018Implementing climate change projects isn\u2019t so much about money.\u2019"
    },
    {
      label: 'D',
      text: "The world\u2019s wetlands are, unfortunately, rich sources for in-demand commodities, such as palm oil and pulpwood. Peatlands \u2013 wetlands with a waterlogged organic soil layer \u2013 are particularly targeted. When peatlands are drained for cultivation, they become net carbon emitters instead of active carbon stores, and, according to Marcel Silvius, head of Climate-smart Land-use at WI, this practice causes six per cent of all global carbon emissions. The clearance of peatlands for planting also increases the risk of forest fires, which release huge amounts of CO\u2082. \u2018We\u2019re seeing huge peatland forests with extremely high biodiversity value being lost for a few decades of oil palm revenues,\u2019 says Silvius."
    },
    {
      label: 'E',
      text: "The damage starts when logging companies arrive to clear the trees. They dig ditches to enter the peat swamps by boat and then float the logs out the same way. These are then used to drain water out of the peatlands to allow for the planting of corn, oil palms or pulpwood trees. Once the water has drained away, bacteria and fungi then break down the carbon in the peat and turn it into CO\u2082 and methane. Meanwhile, the remainder of the solid matter in the peat starts to move downwards, in a process known as subsidence. Peat comprises 90 per cent water, so this is one of the most alarming consequences of peatland clearances. \u2018In the tropics, peat subsides at about four centimetres a year, so within half a century, very large landscapes on Sumatra and Borneo will become flooded as the peat drops below water level,\u2019 says Silvius. \u2018It\u2019s a huge catastrophe that\u2019s in preparation. Some provinces will lose 40 per cent of their landmass.\u2019"
    },
    {
      label: 'F',
      text: "And while these industries affect wetlands in ways that can easily be documented, Dr Dave Tickner of the WWFN believes that more subtle impacts can be even more devastating. \u2018Sediment run-off and fertilizers can be pretty invisible,\u2019 says Tickner. \u2018Over-extraction of water is equally invisible. You do get shock stories about rivers running red, or even catching fire, but there\u2019s seldom one big impact that really hurts a wetland.\u2019 Tickner does not blame anyone for deliberate damage, however. \u2018I\u2019ve worked on wetland issues for 20 years and have never met anybody who wanted to damage a wetland,\u2019 he says. \u2018It isn\u2019t something that people generally set out to do. Quite often, the effects simply come from people trying to make a living.\u2019"
    },
    {
      label: 'G',
      text: "Silvius also acknowledges the importance of income generation. \u2018It\u2019s not that we just want to restore the biodiversity of wetlands \u2013 which we do \u2013 but we recognise there\u2019s a need to provide an income for local people.\u2019 This approach is supported by IWMI. \u2018The idea is that people in a developing country will only protect wetlands if they value and profit from them,\u2019 says McCartney. \u2018For sustainability, it\u2019s essential that local people are involved in wetland planning and decision making and have clear rights to use wetlands.\u2019"
    },
    {
      label: 'H',
      text: "The fortunes of wetlands would be improved, Silvius suggests, if more governments recognized their long-term value. \u2018Different governments have different attitudes,\u2019 he says, and goes on to explain that some countries place a high priority on restoring wetlands, while others still deny the issue. McCartney is cautiously optimistic, however. \u2018Awareness of the importance of wetlands is growing,\u2019 he says. \u2018It\u2019s true that wetland degradation still continues at a rapid pace, but my impression is that things are slowly changing.\u2019"
    },
  ],

  // ── Question sets ──────────────────────────────────────────────────────────
  questionSets: [

    // ── Q14–17: Which paragraph contains... ──────────────────────────────────
    {
      type: 'match-para',
      title: 'Questions 14\u201317',
      instruction: 'Reading Passage 2 has eight paragraphs, <strong>A\u2013H</strong>.\n\nWhich paragraph contains the following information?\n\nWrite the correct letter, <strong>A\u2013H</strong>, in boxes 14\u201317 on your answer sheet.',
      questions: [
        {
          num: 14,
          text: "reference to the need to ensure that inhabitants of wetland regions continue to benefit from them",
          answer: "G",
        },
        {
          num: 15,
          text: "the proportion of wetlands which have already been lost",
          answer: "A",
        },
        {
          num: 16,
          text: "reference to the idea that people are beginning to appreciate the value of wetlands",
          answer: "H",
        },
        {
          num: 17,
          text: "mention of the cultural significance of wetlands",
          answer: "B",
        },
      ],
    },

    // ── Q18–22: Sentence completion (ONE WORD ONLY) ───────────────────────────
    {
      type: 'sentence',
      title: 'Questions 18\u201322',
      instruction: 'Complete the sentences below.\n\nChoose <strong>ONE WORD ONLY</strong> from the passage for each answer.\n\nWrite your answers in boxes 18\u201322 on your answer sheet.',
      questions: [
        {
          num: 18,
          before: "Peatlands which have been drained begin to release",
          after:  "instead of storing it.",
          answer: "carbon",
        },
        {
          num: 19,
          before: "Once peatland areas have been cleared,",
          after:  "are more likely to occur.",
          answer: "fires",
        },
        {
          num: 20,
          before: "Clearing peatland forests to make way for oil palm plantations destroys the",
          after:  "of the local environment.",
          answer: "biodiversity",
        },
        {
          num: 21,
          before: "Water is drained out of peatlands through the",
          after:  "which are created by logging companies.",
          answer: "ditches",
        },
        {
          num: 22,
          before: "Draining peatlands leads to",
          after:  ": a serious problem which can eventually result in coastal flooding and land loss.",
          answer: "subsidence",
        },
      ],
    },

    // ── Q23–26: Match statement to expert ─────────────────────────────────────
    {
      type: 'match-expert',
      title: 'Questions 23\u201326',
      instruction: 'Look at the following statements (Questions 23\u201326) and the list of experts below.\n\nMatch each statement with the correct expert, <strong>A\u2013D</strong>.\n\nWrite the correct letter, <strong>A\u2013D</strong>, in boxes 23\u201326 on your answer sheet.\n\n<em>NB&nbsp; You may use any letter more than once.</em>',
      experts: [
        { label: 'A', name: 'Matthew McCartney' },
        { label: 'B', name: 'Pieter van Eijk'   },
        { label: 'C', name: 'Marcel Silvius'     },
        { label: 'D', name: 'Dave Tickner'       },
      ],
      questions: [
        {
          num: 23,
          text: "Communities living in wetland regions must be included in discussions about the future of these areas.",
          answer: "A",
        },
        {
          num: 24,
          text: "Official policies towards wetlands vary from one nation to the next.",
          answer: "C",
        },
        {
          num: 25,
          text: "People cause harm to wetlands without having any intention to do so.",
          answer: "D",
        },
        {
          num: 26,
          text: "Initiatives to reverse environmental damage need not be complex.",
          answer: "B",
        },
      ],
    },

  ],

};
