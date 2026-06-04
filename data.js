const REGIONS = {
  china: {
    name: "China",
    color: "#c0392b",
    coordinates: { lat: 35, lng: 105 },
    practices: [
      {
        id: "tcm-herbs",
        title: "TCM Herbs",
        timePeriod: "1600–1046 BC",
        ancientUse: "Based on the concept of Yin and Yang — cold-hot, female-male, inside-outside. Herbs, animal products, and minerals used in combination.",
        historicalContext: "Rooted in ancient belief that illness was caused by evil spirits or disrespecting ancestors. Supreme deity Shang Di governed celestial order.",
        modernEvaluation: "Ancient TCM core theories still work for modern disease treatment. Effective for psychogenic, unknown-cause, complex and functional disorders.",
        stillUsed: "Modern TCM comes in four forms: traditional prescription, self-made, hospital-specific, and modern-method produced.",
        limitation: "",
        notUsed: "",
        source: "https://www.sciencedirect.com/science/article/pii/S2667142524000320"
      },
      {
        id: "moxibustion",
        title: "Moxibustion",
        timePeriod: "Over 2500 years ago",
        ancientUse: "Burning moxa wool on acupoints. Dual effect of tonification and purgation, based on the meridian system.",
        historicalContext: "Based on the actions of the meridian system and the roles of moxa and fire.",
        modernEvaluation: "Modern research relates to thermal effects, radiation effects, and pharmacological actions of moxa combustion products.",
        stillUsed: "364 kinds of diseases can be treated with moxibustion.",
        limitation: "",
        notUsed: "",
        source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3789413/"
      },
      {
        id: "acupuncture",
        title: "Acupuncture",
        timePeriod: "Neolithic",
        ancientUse: "Activating specific acupoints on the patient's body. When fully activated, patients feel De Qi — soreness, numbness, fullness, or heaviness.",
        historicalContext: "Yang Jizhou described the full set of 365 acupoints.",
        modernEvaluation: "Efficacy tested over thousands of years, but still not universally recognized.",
        stillUsed: "Can relieve pain, gastrointestinal disorders, and treat stroke.",
        limitation: "In PCOS trials, acupuncture did not increase live birth rates among Chinese women.",
        notUsed: "",
        source: "https://anatomypubs.onlinelibrary.wiley.com/doi/10.1002/ar.24625"
      },
      {
        id: "qigong",
        title: "Qi Gong / Dao Yin",
        timePeriod: "About 2146 BC",
        ancientUse: "Expiration and inspiration, body stretching, massaging, inner alchemy, sitting meditation.",
        historicalContext: "Dao Yin dredges inner passages for qi and blood circulation. Greatly influenced the Inner Canon of the Yellow Emperor.",
        modernEvaluation: "Brain regulation, stress relief, immune and inflammatory adjustment.",
        stillUsed: "Enhances body sensing, suppresses HPA axis reaction, boosts immunity and reduces inflammation.",
        limitation: "",
        notUsed: "",
        source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3589573/"
      }
    ]
  },

  india: {
    name: "India",
    color: "#e67e22",
    coordinates: { lat: 22, lng: 78 },
    practices: [
      {
        id: "ayurveda",
        title: "Ayurveda",
        timePeriod: "2nd century BC",
        ancientUse: "Based on 5 cosmic elements (Air, Water, Space, Earth, Fire) forming 3 bodily humors (Tridoshas): Vata, Pitta, Kapha. Health relies on balanced Tridoshas.",
        historicalContext: "Foundations laid by Hindu philosophical schools Vaisheshika and Nyaya.",
        modernEvaluation: "Validated by thousands of years of clinical use. Shares common therapeutic ground with biomedicine.",
        stillUsed: "Rasayana property helps regulate immunity and treat refractory arthritis. Makes up for unmet demands of modern medicine.",
        limitation: "Standardization and defining clinical indications need answering through modern experiments.",
        notUsed: "",
        source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5198827/"
      },
      {
        id: "siddha",
        title: "Siddha",
        timePeriod: "Ancient India",
        ancientUse: "Holistic approach: medical practice, yogic practice, iatrochemistry, and wisdom. Five elements and three forces, eight methods of examination.",
        historicalContext: "Revolves around the intellectual, psychological, physical, and physiological aspects of all human beings.",
        modernEvaluation: "Can treat diabetes mellitus, obesity, hemiplegia, Parkinsonism, skin diseases, digestive and respiratory disorders, and arthritis.",
        stillUsed: "Treats both acute and chronic illnesses.",
        limitation: "",
        notUsed: "",
        source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9599697/"
      },
      {
        id: "yoga",
        title: "Yoga",
        timePeriod: "2500 years ago",
        ancientUse: "First practiced only by religious ascetics focused on steadiness and stillness of the mind and consciousness.",
        historicalContext: "Traditional definitions focus on the mechanisms of the mind and how it can be stilled.",
        modernEvaluation: "Specific poses target distinct muscle groups. Boosts joint flexibility, balance, spinal mobility, and cognitive ability.",
        stillUsed: "Evolved into dynamic fitness trends: Power Yoga, Vinyasa Flow, Hot Yoga.",
        limitation: "",
        notUsed: "",
        source: "https://www.bbc.com/news/world-40354525"
      },
      {
        id: "homeopathy",
        title: "Homeopathy",
        timePeriod: "Mid 17th–18th centuries",
        ancientUse: "'Like cures like' — mild similar symptoms induced in healthy people can treat severe illness. Drug remedies sorted via the 'proving' method.",
        historicalContext: "Hahnemann self-tested with cinchona bark (quinine), triggering mild malaria-like symptoms.",
        modernEvaluation: "Some high-quality studies yield positive outcomes; patients report personal effectiveness.",
        stillUsed: "FDA's Food, Drug and Cosmetic Act of 1939 allowed homeopathic medicines to be sold openly on the market.",
        limitation: "Evidence remains weak and inconsistent.",
        notUsed: "",
        source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1676328/"
      },
      {
        id: "indian-herbs",
        title: "Indian Herbs (Ayurvedic)",
        timePeriod: "3000 years old",
        ancientUse: "Complex formulae of 30+ ingredients. Used as powders, capsules, teas, topicals, or raw. Based on belief that 'everything can be a drug'.",
        historicalContext: "~25,000 plant-based formulations used in traditional and folk medicines across India.",
        modernEvaluation: "Herbs like Shatavari, Guggul, Nagarmusta have nutraceutical potential.",
        stillUsed: "600+ herbal formulas and 250 single plant drugs in Ayurvedic pharmacy.",
        limitation: "",
        notUsed: "",
        source: "https://onlinelibrary.wiley.com/doi/10.1155/2014/525340"
      }
    ]
  },

  greece: {
    name: "Ancient Greece",
    color: "#2980b9",
    coordinates: { lat: 39, lng: 22 },
    practices: [
      {
        id: "enkoimesis",
        title: "Enkoimesis (Incubation Therapy)",
        timePeriod: "Ancient Greece",
        ancientUse: "Therapeutic incubation at healing shrines of Asclepius and Amphiaraos. Ritual flow: physical and mental purification, bathing, sacrifice. Believers slept in a sacred chamber to receive healing divine dreams.",
        historicalContext: "Asclepius was worshipped as the God of medicine for over 1000 years. His sanctuaries (Asclepieia) were places of worship and healing.",
        modernEvaluation: "Modern research on the placebo effect aligns with some aspects. Marks a key milestone in medicine's evolution — facilitated the shift from ritual practices to Hippocrates' rational medical theories.",
        stillUsed: "Still aligns with modern holistic medicine. Body biochemical/neurophysiological functions closely connected with human soul.",
        limitation: "",
        notUsed: "Outdated for its empirical and mystical nature.",
        source: "https://www.sciencedirect.com"
      },
      {
        id: "four-humors",
        title: "Four Humors & Bloodletting",
        timePeriod: "Galen era (~2nd century AD)",
        ancientUse: "Blood, phlegm, yellow bile, and black bile — each linked to an organ, temperament, season, and element.",
        historicalContext: "Being too hot, cold, dry, or wet disturbed the balance between humors, causing disease. Physicians focused on reestablishing balance.",
        modernEvaluation: "Disproven. Louis Pasteur and Robert Koch's experiments demonstrated the role of foreign bodies in disease.",
        stillUsed: "",
        limitation: "",
        notUsed: "Discovery of microscopic pathogens proved it was fundamentally incorrect. Replaced by germ theory, modern chemistry, and advanced anatomy.",
        source: "https://wi101.wisc.edu/decline-of-humoral-theory/"
      },
      {
        id: "sports-medicine",
        title: "Sports Medicine",
        timePeriod: "5th century BC (Herodicus)",
        ancientUse: "Therapeutic exercise for treatment of disease and maintenance of health. Recorded changes in daily body temperature with the first air thermometer. Measured pulse rate.",
        historicalContext: "Until the 2nd century AD, Galen became the first 'team doctor' for gladiators in Pergamum Kingdom.",
        modernEvaluation: "1890: Harvard implemented programs on personal fitness, gear usage, injury treatment, and rehabilitation.",
        stillUsed: "Sports medicine is a well-established profession in health sciences.",
        limitation: "",
        notUsed: "",
        source: "https://archivosdemedicinadeldeporte.com/articulos/upload/rev01_162.pdf"
      },
      {
        id: "medical-astrology",
        title: "Medical Astrology",
        timePeriod: "Pre-16th century (Greek to Islamic world)",
        ancientUse: "Doctors used patients' zodiac signs for treatment guidance. Treatment decided by moon and star positions.",
        historicalContext: "Pre-Scientific Revolution worldview: no strict divide between heaven and earth. Celestial movements controlled earthly events.",
        modernEvaluation: "Consistently failed under controlled scientific testing. Cannot reliably diagnose or treat physical ailments.",
        stillUsed: "",
        limitation: "",
        notUsed: "Modern biology, germ theory, and heliocentric astronomy disproved that celestial bodies influence human physiology.",
        source: "https://columbiasurgery.org/news/2015/12/17/history-medicine-astrology-medicine"
      }
    ]
  },

  arab: {
    name: "Arab World",
    color: "#27ae60",
    coordinates: { lat: 24, lng: 45 },
    practices: [
      {
        id: "arabic-herbal",
        title: "Arabic Herbal Medicine (AHM)",
        timePeriod: "754 CE",
        ancientUse: "Natural remedies — organic (e.g. camel urine) and inorganic. Dosage forms: decoction, infusion, oil, juice, syrup, roasted materials, poultice, paste.",
        historicalContext: "Three stages: Greek works translated into Arabic → independent Arabian medical development → Arabic texts translated into Latin.",
        modernEvaluation: "129 plant species still used for liver, skin, respiratory, digestive, and cancer diseases in Mediterranean. 89% of surveyed species possess medicinal value.",
        stillUsed: "Affordable and effective. Modern ethnopharmacologists validate historically used plants like black seed and aloe.",
        limitation: "No governmental regulation on manufacture, purity, concentration, or labeling of herbal remedies.",
        notUsed: "",
        source: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1697757/"
      },
      {
        id: "unani",
        title: "Unani",
        timePeriod: "Ancient (Greek-Arab origin)",
        ancientUse: "Dietotherapy (targeted meals), Organotherapy (healthy animal organs applied to treat diseased human organs), Pharmacotherapy. Unites spiritual, mental, and physical realms.",
        historicalContext: "7 vital physiological principles, 4 elements, 4 temperaments.",
        modernEvaluation: "Notable outcomes in rheumatoid arthritis, vitiligo, and bronchial asthma. Filed patents for several formulations.",
        stillUsed: "Shifted from apprentice-based model to standardized university-level degrees (B.U.M.S.) blending ancient texts with modern science.",
        limitation: "Perceived as slow-acting compared to allopathic medicine. Integration with modern practice needed.",
        notUsed: "",
        source: "https://www.researchgate.net/publication/394169371"
      },
      {
        id: "essential-oil",
        title: "Essential Oils",
        timePeriod: "Since 4500 BC",
        ancientUse: "Ancient Egypt: religious rituals, cosmetics, embalming. Greece: used in baths and massages for pharmaceutical purposes.",
        historicalContext: "Distilled cedarwood oil used by Egyptians. Rose essence distillation refined by 11th century Persian scholar Ibn Sina.",
        modernEvaluation: "Mixed evidence. 2024 studies show aromatherapy can improve sleep, decrease anxiety and nausea, reduce menstrual bleeding.",
        stillUsed: "Aromatherapy shown to improve sleep symptoms, decrease anxiety and nausea.",
        limitation: "Small sample sizes and wide variety of interventions make it hard to generalize results.",
        notUsed: "",
        source: "https://en.wikipedia.org/wiki/Aromatherapy"
      }
    ]
  },

  egypt: {
    name: "Ancient Egypt",
    color: "#f39c12",
    coordinates: { lat: 26, lng: 30 },
    practices: [
      {
        id: "papyrus-ebers",
        title: "Papyrus Ebers (Medical Text)",
        timePeriod: "1500 BCE",
        ancientUse: "Contains over 700 remedies and formulas for conditions ranging from burns and parasites to snake bites and mental disorders.",
        historicalContext: "Written in ancient Egypt around 1550 BCE. 110-page scroll, roughly 20 meters long. Copied from older Egyptian manuscripts.",
        modernEvaluation: "Many ingredients used in ancient Egyptian remedies are still used for the same purpose today, confirmed using modern methods.",
        stillUsed: "Several ancient remedies validated by modern biological research.",
        limitation: "Hieratic medical texts often require context-specific medical expertise to translate.",
        notUsed: "",
        source: "https://pmc.ncbi.nlm.nih.gov"
      },
      {
        id: "honey",
        title: "Honey / Apitherapy",
        timePeriod: "3,000–5,000 years (China, Egypt, Greece)",
        ancientUse: "Using beehive products to prevent and treat disease. Documented by Hippocrates and Aristotle.",
        historicalContext: "Therapeutic benefits documented in the Bible, Vedas, and Quran.",
        modernEvaluation: "Rich in bioactive compounds. Has antioxidant, antimicrobial, and anti-inflammatory effects. Effective against common clinical pathogens.",
        stillUsed: "Integrated into hydrogels, dressings, and ointments.",
        limitation: "No established validated method for determining in vitro antimicrobial potential of natural product-based formulations.",
        notUsed: "",
        source: "https://doi.org/10.3390/antibiotics11070975"
      },
      {
        id: "egyptian-dental",
        title: "Egyptian Dental Care",
        timePeriod: "Ancient Egypt",
        ancientUse: "Surgically drilling through the mandibular bone to drain abscesses. Dental bridges to replace missing teeth.",
        historicalContext: "Main cause of dental problems: rough fibrous diet. Inorganic sand particles in bread heightened abrasiveness. Sand blown by wind mixed into staple food.",
        modernEvaluation: "While they devised brilliant pharmaceutical poultices and herbal analgesics, severe dental wear, abscesses, and gum disease ultimately went mostly unmanaged.",
        stillUsed: "",
        limitation: "Severe dental conditions largely unmanaged by available techniques.",
        notUsed: "",
        source: "https://pmc.ncbi.nlm.nih.gov"
      },
      {
        id: "mummification",
        title: "Mummification (Anatomical Knowledge)",
        timePeriod: "Ancient Egypt",
        ancientUse: "Preservation of the body through mummification process, which generated extensive anatomical knowledge.",
        historicalContext: "The practice of mummification required detailed understanding of human organs and body systems.",
        modernEvaluation: "Provided foundational anatomical knowledge that informed early medical understanding.",
        stillUsed: "",
        limitation: "",
        notUsed: "",
        source: ""
      }
    ]
  },

  maya: {
    name: "Maya / Americas",
    color: "#8e44ad",
    coordinates: { lat: 15, lng: -90 },
    practices: [
      {
        id: "maya-herbalism",
        title: "Maya Herbalism",
        timePeriod: "250–900 AD, continued to present",
        ancientUse: "Yellow plants for jaundice, red for blood problems, burned feathers of red birds for yellow fever.",
        historicalContext: "Rich understanding of human anatomy.",
        modernEvaluation: "Some plants show scientifically supported pharmacological effects; not all remedies are proven safe.",
        stillUsed: "",
        limitation: "",
        notUsed: "Globalization and migration of apprentices have led to practice being threatened or disappearing.",
        source: "https://www.researchgate.net/publication/22366999_Medicine_Among_the_Ancient_Maya"
      },
      {
        id: "bone-setting",
        title: "Bone Setting",
        timePeriod: "Ancient (India, China, Maya)",
        ancientUse: "Assess injuries via swelling, bruising, and movement tests. Use herbal ointment massage and herbal tea for recovery.",
        historicalContext: "Maya bone-setters soothe patients and inquire about injury details. Herbs shifted from wild collection to home cultivation.",
        modernEvaluation: "Highly adept at massage, joint mobilization, and reduction of simple dislocations. Significant relief for chronic musculoskeletal pain.",
        stillUsed: "Bioactive compounds (terpenoids, alkaloids, flavonoids) are candidates for pharmacological bone-healing studies.",
        limitation: "Traditional immobilization less rigid than biomedical casting — can lead to malunion or nonunion.",
        notUsed: "",
        source: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0346125"
      },
      {
        id: "maya-dentistry",
        title: "Maya Dental Fillings",
        timePeriod: "Classical Maya period",
        ancientUse: "Dental fillings using complex cements and jade inlays.",
        historicalContext: "Maya diet of maize increased likelihood of cavities. Environmental and genetic factors also played a role.",
        modernEvaluation: "Replaced by modern dentistry.",
        stillUsed: "",
        limitation: "",
        notUsed: "Modern materials — composite resins, glass ionomers, porcelain — bond directly to teeth, harden with UV light, and match natural shades.",
        source: "https://www.researchgate.net/publication/339362026"
      },
      {
        id: "maya-psychiatry",
        title: "Maya Psychiatry",
        timePeriod: "Classical Maya period",
        ancientUse: "Healers 'read' patients like texts. Procedures: prayers (k'ochob'ank), flower therapy, smoking the patient, 'calling back' trapped spirits.",
        historicalContext: "Mental illness seen as result of moral transgressions or violations of shared order.",
        modernEvaluation: "Evaluated as empirical and rational. Many categories mirror Western DSM-5 diagnoses (e.g. rahil ch'ool = Major Depressive Disorder).",
        stillUsed: "Offers culturally sensitive restorative healing that biomedicine lacks.",
        limitation: "",
        notUsed: "",
        source: "https://www.researchgate.net/publication/272186786"
      },
      {
        id: "willow-bark",
        title: "Willow Bark",
        timePeriod: "3500 years ago (Sumerian & Egyptian)",
        ancientUse: "Used by Native Americans and ancient civilizations as a natural painkiller and anti-inflammatory. Active ingredient salicin converts to salicylic acid in the body.",
        historicalContext: "Ancient civilizations used willow bark primarily as a natural painkiller. Salicin is the exact precursor to modern aspirin.",
        modernEvaluation: "Modern science validates ancient usage. Salicin acts as a natural prodrug to salicylic acid.",
        stillUsed: "In 1828, salicin was isolated; by 1897 Bayer synthesized acetylsalicylic acid (Aspirin) — direct descendant of this remedy.",
        limitation: "",
        notUsed: "",
        source: ""
      },
      {
        id: "trepanation",
        title: "Trepanation",
        timePeriod: "Ancient (worldwide)",
        ancientUse: "Therapeutic trepanation to treat cranial fractures, mastoiditis, meningiomas, and leprosy. Cultural and symbolic trepanations done for religious or ritualistic reasons.",
        historicalContext: "Three main purposes proposed: therapeutic, cultural, and symbolic.",
        modernEvaluation: "Modern surgeons recognize high risk and avoid performance.",
        stillUsed: "",
        limitation: "High surgical risk.",
        notUsed: "Surgeons recognize high risk and avoid performance in favor of safer modern neurosurgical techniques.",
        source: "https://pmc.ncbi.nlm.nih.gov"
      }
    ]
  }
};

window.REGIONS = REGIONS;
