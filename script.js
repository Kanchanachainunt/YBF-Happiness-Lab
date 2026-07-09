// Global State Management
const gameState = {
  userProfile: {
    name: "",
    age: null
  },
  userHappinessText: "",
  matchedCards: [],
  selectedCard: null
};

// Hand-drawn SVG crayon icons for the child cards
const icons = {
  cloud: `
    <svg class="w-16 h-16 transform rotate-2" viewBox="0 0 100 100" style="filter: url(#crayon-filter);">
      <!-- Scribbled Fill -->
      <path d="M25,50 h40 M20,45 h55 M15,40 h65 M20,35 h50 M30,30 h30 M25,52 h45" stroke="#8ECAE6" stroke-width="6" stroke-linecap="round" opacity="0.65"/>
      <!-- Rough Outline -->
      <path d="M25,55 C20,55 15,50 15,44 C15,38 22,33 29,33 C32,23 42,16 53,16 C64,16 72,23 74,33 C80,33 85,38 85,44 C85,50 80,55 75,55 Z" fill="none" stroke="#219EBC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
  tree: `
    <svg class="w-16 h-16 transform -rotate-3" viewBox="0 0 100 100" style="filter: url(#crayon-filter);">
      <!-- Trunk Scribble -->
      <path d="M47,55 L47,75 C47,77 53,77 53,75 L53,55 Z" fill="#8B5A2B" stroke="#603813" stroke-width="3" />
      <!-- Leaf Scribble Fill -->
      <path d="M40,30 h20 M35,35 h30 M32,40 h35 M35,45 h30 M42,25 h15 M40,48 h20" stroke="#70E000" stroke-width="6" stroke-linecap="round" opacity="0.65" />
      <!-- Outline -->
      <path d="M50,18 C38,18 30,28 35,38 C28,45 35,55 48,52 C52,55 68,52 64,43 C72,36 65,18 50,18 Z" fill="none" stroke="#38B000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
  heart: `
    <svg class="w-16 h-16 transform rotate-6" viewBox="0 0 100 100" style="filter: url(#crayon-filter);">
      <!-- Scribble Fill -->
      <path d="M25,25 h40 M20,35 h55 M15,45 h65 M20,55 h55 M30,65 h35 M40,75 h15" stroke="#E63946" stroke-width="6" stroke-linecap="round" opacity="0.65" />
      <!-- Outline -->
      <path d="M50,30 C50,30 45,15 30,15 C15,15 10,28 10,40 C10,60 38,78 50,85 C62,78 90,60 90,40 C90,28 85,15 70,15 C55,15 50,30 50,30 Z" fill="none" stroke="#D62828" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
  sun: `
    <svg class="w-16 h-16 transform -rotate-6" viewBox="0 0 100 100" style="filter: url(#crayon-filter);">
      <!-- Rays -->
      <path d="M50,10 L50,20 M50,80 L50,90 M10,50 L20,50 M80,50 L90,50 M22,22 L30,30 M70,70 L78,78 M22,78 L30,70 M70,22 L78,30" stroke="#F4A261" stroke-width="3" stroke-linecap="round" />
      <!-- Scribble Fill -->
      <circle cx="50" cy="50" r="15" fill="#FFD166" opacity="0.65" />
      <!-- Sun Outline -->
      <circle cx="50" cy="50" r="22" fill="none" stroke="#F4A261" stroke-width="3" />
      <!-- Eyes & Smile -->
      <circle cx="43" cy="46" r="2.5" fill="#503E3D" />
      <circle cx="57" cy="46" r="2.5" fill="#503E3D" />
      <path d="M42,54 C45,58 55,58 58,54" stroke="#503E3D" stroke-width="2.5" stroke-linecap="round" fill="none" />
    </svg>
  `
};

// Database configuration & categories for on-the-fly client-side tagging
const categories = {
  creative: ['สี', 'สีไม้', 'วาด', 'เขียน', 'สมุด', 'ดินสอ', 'ชอล์ก', 'กระดาน', 'ศิลปะ'],
  sports: ['วิ่ง', 'เตะ', 'ฟุตบอล', 'บอล', 'จักรยาน', 'ปั่น', 'ขี่', 'กีฬา', 'ออกกำลัง', 'สนาม', 'กระโดดยาง', 'ตกปลา', 'เบ็ด', 'ปีน', 'ว่าว', 'แช่น้ำ', 'เล่นน้ำ', 'กระโดดน้ำ'],
  toys: ['เลโก้', 'ตัวต่อ', 'ตุ๊กตา', 'การ์ด', 'หมากเก็บ', 'ของเล่น', 'ลูกโป่งวิทยาศาสตร์', 'ดินน้ำมัน', 'กล้อง', 'เกมเศรษฐี', 'ลูกแก้ว', 'รถบังคับ', 'สบู่ก้อน'],
  drink: ['โกโก้', 'น้ำเก๊กฮวย', 'น้ำอัดลม', 'นมเย็น', 'เฉาก๊วย', 'ไอติม', 'ไอศกรีม', 'น้ำแข็งใส', 'น้ำแดง', 'ชง'],
  food: ['กิน', 'อร่อย', 'ข้าว', 'อาหาร', 'แกง', 'ส้มตำ', 'ปลาทู', 'หมูสะเต๊ะ', 'ลูกชิ้น', 'ซาลาเปา', 'มันเผา', 'มะยมดอง', 'ส้มสายน้ำผึ้ง', 'โดนัท', 'โตเกียว', 'วาฟเฟิล', 'ป็อปคอร์น', 'โยเกิร์ต', 'ทอดมัน', 'ขนมเบื้อง', 'มาม่า', 'บะหมี่', 'ทอด', 'ต้ม', 'ย่าง', 'ปิ้ง', 'แกะเนื้อ'],
  family: ['นิทาน', 'ยาย', 'กอด', 'แม่', 'พ่อ', 'ฝันดี', 'ปลอดภัย', 'อบอุ่น', 'หนุนตัก'],
  nature: ['ทะเล', 'หอย', 'เปลือกหอย', 'ชายหาด', 'คลอง', 'สวน', 'ปลา', 'ภูเขา', 'น้ำตก']
};

const categoryLabels = {
  drink: 'เครื่องดื่มแสนหวาน',
  food: 'ของอร่อยฝีมือคนที่รัก',
  sports: 'การละเล่นและกีฬาโลดโผน',
  toys: 'ของเล่นและเกมน่าตื่นเต้น',
  creative: 'ศิลปะและจินตนาการสร้างสรรค์',
  family: 'ความรักและอ้อมกอดในบ้าน',
  nature: 'ธรรมชาติและการสำรวจผจญภัย'
};

const categoryIcons = {
  drink: 'sun',
  food: 'sun',
  sports: 'cloud',
  toys: 'heart',
  creative: 'tree',
  family: 'heart',
  nature: 'tree'
};

const categoryImages = {
  drink: 'assets/icecream.jpg',
  food: 'assets/icecream.jpg',
  sports: 'assets/soccer.jpg',
  toys: 'assets/blocks.jpg',
  creative: 'assets/pencils.jpg',
  family: 'assets/sketchbook.jpg',
  nature: 'assets/bicycle.jpg'
};

// RFC 4180 compliant CSV Parser in vanilla JavaScript
function parseCSV(text) {
  const lines = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push("");
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      lines.push(row);
      row = [""];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }
  return lines;
}

// Database containing children's happiness stories (loaded dynamically)
let kidsHappinessDatabase = [];

// Loads database from Google Sheets in real-time with local offline JSON fallback
function loadDatabase() {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/1Ke30Rub6xYhTq-qExEU3UcbcUtQSpysZNP16vyH5jL0/export?format=csv';
  const fallbackUrl = 'assets/kids_stories.json';

  fetch(sheetUrl)
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.text();
    })
    .then(csvText => {
      const rows = parseCSV(csvText);
      if (rows.length > 0) rows.shift(); // Remove header row
      
      kidsHappinessDatabase = rows.map(row => {
        if (row.length < 4) return null;
        const no = parseInt(row[0]);
        const title = row[1];
        const owner = row[2];
        const reason = row[3];
        
        if (isNaN(no) || !title) return null;

        // Semantic Category Classification (on-the-fly)
        const textToSearch = (title + ' ' + reason).toLowerCase();
        let cleanText = textToSearch
          .replace(/หมู่บ้าน/g, '___บ้าน')
          .replace(/พลาสติก/g, '___สติก')
          .replace(/ปลาทู/g, '___ทู');

        let category = 'toys';
        for (const [cat, kws] of Object.entries(categories)) {
          let matched = false;
          for (const kw of kws) {
            if (cleanText.includes(kw)) {
              category = cat;
              matched = true;
              break;
            }
          }
          if (matched) break;
        }

        // Keywords expansion for search
        let extraKeywords = [];
        if (category === 'drink') extraKeywords = ['กาแฟ', 'คาเฟ่', 'บาริสต้า', 'หวาน', 'ชื่นใจ', 'แก้ว', 'น้ำ', 'ชง', 'โกโก้'];
        else if (category === 'food') extraKeywords = ['กิน', 'ชวน', 'อร่อย', 'อาหาร', 'จาน', 'มื้อ', 'บุฟเฟต์', 'ชาบู', 'ปิ้งย่าง', 'ข้าว'];
        else if (category === 'sports') extraKeywords = ['ออกกำลังกาย', 'ฟิตเนส', 'วิ่ง', 'เตะบอล', 'เหนื่อย', 'ปั่นจักรยาน', 'กีฬา', 'สุขภาพ'];
        else if (category === 'toys') extraKeywords = ['ของเล่น', 'เกม', 'สนุก', 'สะสม', 'เล่นเกม', 'เลโก้', 'การ์ด'];
        else if (category === 'creative') extraKeywords = ['วาดเขียน', 'ระบายสี', 'ศิลปะ', 'รูปภาพ', 'สมุด', 'ดินสอ', 'สีเทียน'];
        else if (category === 'family') extraKeywords = ['แฟน', 'ครอบครัว', 'พ่อแม่', 'กอด', 'อบอุ่น', 'รัก', 'เพื่อน'];
        else if (category === 'nature') extraKeywords = ['ท่องเที่ยว', 'เดินทาง', 'ทะเล', 'ภูเขา', 'วิว', 'คลอง', 'เที่ยว'];

        const rawWords = textToSearch.match(/[ก-์a-zA-Z0-9]+/g) || [];
        const cleanRaw = rawWords.filter(w => w.length > 2);
        const keywords = Array.from(new Set([title, owner, ...extraKeywords, ...cleanRaw]));

        // Select matching image asset (original + 10 new AI-generated child illustrations)
        let imgPath = 'assets/blocks.jpg'; // Default fallback
        const searchPool = (title + ' ' + reason).toLowerCase();
        
        const hasKeyword = (words) => words.some(w => searchPool.includes(w));

        // 1. Beach/Sea/Shells
        if (hasKeyword(['ทะเล', 'ชายหาด', 'เปลือกหอย', 'บางแสน'])) {
          imgPath = 'assets/beach.jpg';
        }
        // 2. Cycling/Bicycle
        else if (hasKeyword(['จักรยาน', 'ปั่น'])) {
          imgPath = 'assets/bicycle.jpg';
        }
        // 3. Soccer/Football
        else if (hasKeyword(['ฟุตบอล', 'เตะบอล', 'เตะลูกบอล', 'ลูกบอล'])) {
          imgPath = 'assets/soccer.jpg';
        }
        // 4. Drawing/Coloring/Pencils
        else if (hasKeyword(['สีไม้', 'ดินสอสี', 'สีเทียน', 'ระบายสี'])) {
          imgPath = 'assets/pencils.jpg';
        }
        // 5. Drawing books/Sketchbooks/Painting on board
        else if (hasKeyword(['สมุดวาด', 'วาดเขียน', 'กระดานดำ', 'วาดยักษ์', 'วาดรูป', 'ชอล์ก'])) {
          imgPath = 'assets/sketchbook.jpg';
        }
        // 6. Sweet Treats/Ice Cream/Beverages
        else if (hasKeyword(['ไอติม', 'ไอศกรีม', 'โกโก้', 'น้ำเก๊กฮวย', 'น้ำอัดลม', 'เฉาก๊วย', 'ชานม', 'สลีป', 'หวาน', 'ชง'])) {
          imgPath = 'assets/icecream.jpg';
        }
        // 7. Toys/Blocks/Legos
        else if (hasKeyword(['เลโก้', 'ตัวต่อ', 'บล็อกไม้', 'ของเล่น', 'รถบังคับ', 'หุ่นยนต์', 'ของขวัญ'])) {
          imgPath = 'assets/blocks.jpg';
        }
        // 8. Pets/Dogs/Cats
        else if (hasKeyword(['หมา', 'แมว', 'สุนัข', 'ลูกสุนัข', 'กระดิกหาง', 'เลียหน้า'])) {
          imgPath = 'assets/dog_cat.jpg';
        }
        // 9. Thai Street Food
        else if (hasKeyword(['ลูกชิ้นทอด', 'โตเกียว', 'ขนมโตเกียว', 'ส้มตำ', 'หมูสะเต๊ะ', 'ข้าวโพด', 'วาฟเฟิล', 'ขนมเบื้อง', 'ทอดมัน', 'โดนัท'])) {
          imgPath = 'assets/street_food.jpg';
        }
        // 10. Family dishes/Mackerel/Home Cooked meals
        else if (hasKeyword(['ปลาทู', 'แกงจืด', 'ยายแกะ', 'ยายทำ', 'ยายทอด', 'แม่ต้ม', 'ยายต้ม', 'ต้มยำ', 'ข้าวสวย', 'มาม่า', 'บะหมี่'])) {
          imgPath = 'assets/family_dish.jpg';
        }
        // 11. Board games/Cards/Console
        else if (hasKeyword(['การ์ดยูกิ', 'เกมกด', 'เกมเศรษฐี', 'หมากเก็บ', 'ทอยลูกเต๋า', 'หมากรุก', 'การ์ดของเล่น'])) {
          imgPath = 'assets/board_game.jpg';
        }
        // 12. Bedtime/Blanket/Cozy sleeping
        else if (hasKeyword(['นิทาน', 'ก่อนนอน', 'ผ้าห่ม', 'นอนหนุนตัก', 'เตียง', 'นอนกอด', 'กอดนอน', 'หนุนตักยาย'])) {
          imgPath = 'assets/bedtime.jpg';
        }
        // 13. School items/Shoes/Uniform
        else if (hasKeyword(['รองเท้า', 'กระเป๋าใหม่', 'ดินสอกด', 'เครื่องเขียน', 'ดินสอพละ'])) {
          imgPath = 'assets/school_items.jpg';
        }
        // 14. Water playing/Rain/Umbrella/Songkran
        else if (hasKeyword(['แช่น้ำ', 'เล่นน้ำ', 'คลอง', 'สงกรานต์', 'สาดน้ำ', 'สระน้ำ', 'โดดน้ำ'])) {
          imgPath = 'assets/rain_umbrella.jpg';
        }
        // 15. Bubble soap/Dough playing
        else if (hasKeyword(['ลูกโป่งวิทยาศาสตร์', 'สบู่ก้อน', 'ดินน้ำมัน', 'เป่าฟอง', 'เป่าลูกโป่ง'])) {
          imgPath = 'assets/bubble_soap.jpg';
        }
        // 16. Kites/Flying adventures/Outdoor climbing
        else if (hasKeyword(['ปีนต้นไม้', 'วิ่งเล่นว่าว', 'เล่นว่าว', 'ว่าว'])) {
          imgPath = 'assets/kite_adventure.jpg';
        }
        else {
          imgPath = categoryImages[category];
        }

        return {
          id: no,
          title: title,
          owner: owner,
          reason: reason,
          image: imgPath,
          category: category,
          categoryLabel: categoryLabels[category],
          iconName: categoryIcons[category],
          keywords: keywords
        };
      }).filter(item => item !== null);

      console.log(`Successfully loaded ${kidsHappinessDatabase.length} entries directly from live Google Sheet!`);
    })
    .catch(err => {
      console.warn("Using offline fallback database due to sheet load error:", err);
      fetch(fallbackUrl)
        .then(res => res.json())
        .then(data => {
          kidsHappinessDatabase = data;
          console.log(`Successfully loaded ${kidsHappinessDatabase.length} entries from offline fallback JSON.`);
        })
        .catch(offlineErr => {
          console.error("Critical error: offline fallback database failed to load:", offlineErr);
        });
    });
}

// Document Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  loadDatabase();
  setupValidation();
});

// Setup Form Validations on Screen 2 and 3
function setupValidation() {
  const nameInput = document.getElementById("input-name");
  const ageInput = document.getElementById("input-age");
  const onboardBtn = document.getElementById("btn-onboard-submit");

  const happinessInput = document.getElementById("input-happiness");
  const charCounter = document.getElementById("char-counter");
  const happinessBtn = document.getElementById("btn-happiness-submit");

  // Onboarding Screen Inputs Validate
  const checkOnboardValidity = () => {
    const nameVal = nameInput.value.trim();
    const ageVal = parseInt(ageInput.value);
    const isAgeValid = !isNaN(ageVal) && ageVal > 0 && ageVal <= 120;
    const isNameValid = nameVal.length > 0;

    if (isNameValid && isAgeValid) {
      onboardBtn.removeAttribute("disabled");
      onboardBtn.className = "pill-btn-orange w-40 mx-auto py-2.5 rounded-full font-title font-medium text-sm transition";
    } else {
      onboardBtn.setAttribute("disabled", "true");
      onboardBtn.className = "w-40 mx-auto py-2.5 bg-warm-800/10 text-warm-800/30 cursor-not-allowed font-title font-medium text-sm rounded-full transition duration-300";
    }
  };

  nameInput.addEventListener("input", checkOnboardValidity);
  ageInput.addEventListener("input", checkOnboardValidity);

  // Happiness Text Area Validate
  happinessInput.addEventListener("input", () => {
    const textVal = happinessInput.value;
    charCounter.innerText = textVal.length;

    // We allow submit when user writes at least 5 characters
    if (textVal.trim().length >= 5) {
      happinessBtn.removeAttribute("disabled");
      happinessBtn.className = "pill-btn-orange w-40 mx-auto py-2.5 rounded-full font-title font-medium text-sm transition";
    } else {
      happinessBtn.setAttribute("disabled", "true");
      happinessBtn.className = "w-40 mx-auto py-2.5 bg-warm-800/10 text-warm-800/30 cursor-not-allowed font-title font-medium text-sm rounded-full transition duration-300";
    }
  });
}

// Transitions between Screens
function goToScreen(screenNum) {
  // Find current active screen
  const activeScreen = document.querySelector("section:not(.hidden)");
  if (!activeScreen) return;

  // Animate out the active screen
  activeScreen.classList.add("opacity-0", "translate-y-4");
  
  setTimeout(() => {
    activeScreen.classList.add("hidden");
    
    // Prepare and animate in target screen
    const targetScreen = document.getElementById(`screen-${screenNum}`);
    targetScreen.classList.remove("hidden");
    
    // Force a browser reflow/repaint to trigger transition
    targetScreen.offsetHeight;
    
    targetScreen.classList.remove("opacity-0", "translate-y-4");
    targetScreen.classList.add("fade-in-up");

    // Handle screen-specific dynamic scripts/loading
    if (screenNum === 4) {
      runAnalysisSimulation();
    }

    // Dynamic copy of cards to stacked placeholders on Screen 7, 8, 9, 10
    if (screenNum >= 7 && screenNum <= 9) {
      const userCardHtml = document.querySelector("#screen-6 .notebook-paper:nth-child(1)").innerHTML;
      const kidCardHtml = document.querySelector("#screen-6 .notebook-paper:nth-child(2)").innerHTML;
      
      const userStacked = document.getElementById(`stacked-user-card-s${screenNum}`);
      const kidStacked = document.getElementById(`stacked-kid-card-s${screenNum}`);
      
      if (userStacked && kidStacked) {
        userStacked.className = "notebook-paper p-3 sm:p-3.5 relative shadow-sm -rotate-[2deg] transition duration-500 bg-[#FCFBF7] text-left w-full h-full flex flex-col";
        userStacked.innerHTML = userCardHtml;
        
        kidStacked.className = "notebook-paper p-3 sm:p-3.5 relative shadow-md rotate-[2deg] transition duration-500 bg-[#FCFBF7] text-left w-full h-full flex flex-col";
        kidStacked.innerHTML = kidCardHtml;
      }
    } else if (screenNum === 10) {
      const kidCardHtml = document.querySelector("#screen-6 .notebook-paper:nth-child(2)").innerHTML;
      const kidCardPlaceholder = document.getElementById("screen-10-kid-card-placeholder");
      if (kidCardPlaceholder) {
        kidCardPlaceholder.className = "notebook-paper p-5 sm:p-6 relative scale-90 md:scale-95 origin-center shadow-md bg-[#FCFBF7] text-left w-full max-w-sm";
        kidCardPlaceholder.innerHTML = kidCardHtml;
      }
    }
  }, 400); // matches transition
}

// Submission functions
function submitOnboarding() {
  const nameVal = document.getElementById("input-name").value.trim();
  const ageVal = parseInt(document.getElementById("input-age").value);
  
  gameState.userProfile.name = nameVal;
  gameState.userProfile.age = ageVal;

  // Update dynamic user placeholders in UI
  document.querySelectorAll(".user-name-placeholder").forEach(el => el.innerText = nameVal);
  document.getElementById("display-user-name").innerText = nameVal;

  goToScreen(3);
}

// Format raw text into HTML wrapped on notebook lines
function formatNotebookText(text) {
  // Clear any existing contents and split text into roughly equal chunks or wrap in standard container
  return text;
}

function submitHappiness() {
  const storyVal = document.getElementById("input-happiness").value.trim();
  gameState.userHappinessText = storyVal;

  // Update display values
  document.getElementById("display-user-story").innerText = storyVal;
  document.getElementById("context-user-story").innerText = storyVal;
  document.getElementById("reveal-user-story").innerText = storyVal;

  // Trigger matching algorithm
  matchHappinessStory(storyVal);

  goToScreen(4);
}

// Simple heuristic text matching logic
function matchHappinessStory(inputText) {
  const textLower = inputText.toLowerCase();
  
  // 1. Calculate matching score for each of the 200 items
  const scoredItems = kidsHappinessDatabase.map(item => {
    let score = 0;
    
    // Match category keyword list
    if (item.keywords && Array.isArray(item.keywords)) {
      item.keywords.forEach(keyword => {
        if (keyword && textLower.includes(keyword.toLowerCase())) {
          score += 5; // keyword match
        }
      });
    }

    // Match category name
    if (textLower.includes(item.category.toLowerCase())) {
      score += 10;
    }

    // Match title name
    if (textLower.includes(item.title.toLowerCase())) {
      score += 15;
    }

    // Match text story content (character overlap / token check)
    const reasonClean = item.reason.replace(/[^\w\sก-์]/g, '');
    const words = reasonClean.split(/\s+/);
    words.forEach(w => {
      if (w.length > 2 && textLower.includes(w)) {
        score += 2;
      }
    });

    return { ...item, score };
  });

  // 2. Sort descending by score
  scoredItems.sort((a, b) => b.score - a.score);

  // 3. Filter items that have at least some match score
  const matchedItems = scoredItems.filter(item => item.score > 0);

  if (matchedItems.length >= 4) {
    // We have at least 4 matched cards! Take top 4
    gameState.matchedCards = matchedItems.slice(0, 4);
  } else {
    // Not enough matched cards (less than 4)
    // We fill the remaining slots from the general database randomly
    const remainingCount = 4 - matchedItems.length;
    const matchedIds = new Set(matchedItems.map(item => item.id));
    
    const unmatchedPool = scoredItems.filter(item => !matchedIds.has(item.id));
    // Shuffle unmatched pool
    const shuffledUnmatched = [...unmatchedPool].sort(() => 0.5 - Math.random());
    
    // Combine matched and shuffled unmatched
    gameState.matchedCards = [...matchedItems, ...shuffledUnmatched.slice(0, remainingCount)];
  }

  // Assign correct crayon icons
  gameState.matchedCards.forEach((card, idx) => {
    card.assignedIcon = card.iconName || "sun";
  });

  // Render cards to grid
  renderMatchGrid();
}

// Render Screen 5 Match Card Grid (2x2 Terracotta Sparkle Card Covers)
function renderMatchGrid() {
  const grid = document.getElementById("match-cards-grid");
  grid.innerHTML = "";

  gameState.matchedCards.forEach((card, idx) => {
    const cardEl = document.createElement("div");
    
    // Slight rotations to make them look naturally scattered in the 2x2 grid
    const rotations = ["-rotate-[3deg]", "rotate-[2deg]", "-rotate-[1deg]", "rotate-[3deg]"];
    const rotClass = rotations[idx % rotations.length];
    
    cardEl.className = `w-40 h-28 md:w-48 md:h-32 cursor-pointer relative card-cover-pattern rounded-2xl border-2 border-white shadow-md select-none ${rotClass} transition-all duration-300 hover:scale-105 hover:shadow-lg`;
    cardEl.onclick = () => selectCard(card.id);
    
    cardEl.innerHTML = `
      <!-- Front: Plain cream rounded rectangle card cover -->
      <div class="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-4">
        <!-- Sparkle Star Icon in Soft Orange/Coral (text-primary/75) -->
        <svg class="w-10 h-10 text-primary/75 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <!-- Star sparkle -->
          <path d="M12 5 C12,8.5 14.5,11 18,11 C14.5,11 12,13.5 12,17 C12,13.5 9.5,11 6,11 C9.5,11 12,8.5 12,5 Z" fill="currentColor" stroke="none" />
          <!-- Plus/Dot symbol next to star -->
          <circle cx="9.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
          <path d="M16 7 h2 M17 6 v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>
    `;
    grid.appendChild(cardEl);
  });
}

// User select card interactions (Direct transition without flip or hover)
function selectCard(cardId) {
  // Prevent double click
  if (gameState.selectedCard) return;

  const card = gameState.matchedCards.find(item => item.id === cardId);
  if (!card) return;

  gameState.selectedCard = card;

  // Update Reveal Screen (Screen 6) contents
  document.getElementById("reveal-kid-name").innerText = card.owner;
  document.getElementById("reveal-kid-title").innerText = card.title;
  document.getElementById("reveal-kid-reason").innerText = card.reason;
  document.getElementById("reveal-kid-image").src = card.image;

  // Transition immediately to Reveal Screen
  goToScreen(6);
}

// Analysis Loading Simulation (Screen 4)
function runAnalysisSimulation() {
  const statusText = document.getElementById("analysis-status-text");
  const spinner = document.getElementById("analysis-spinner");
  const nextBtn = document.getElementById("btn-analysis-next");

  // Reset analysis elements
  spinner.className = "w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin";
  nextBtn.setAttribute("disabled", "true");
  nextBtn.className = "w-40 mx-auto py-2.5 bg-warm-800/10 text-warm-800/30 cursor-not-allowed font-title font-medium text-sm rounded-full transition duration-300";

  const simulationSteps = [
    { text: "กำลังประมวลผลคำศัพท์เคมีแห่งความรู้สึก...", delay: 1000 },
    { text: "กำลังค้นหาคลื่นความสุขดวงน้อยของเด็กๆ ยุวพัฒน์...", delay: 2200 },
    { text: "เสร็จสิ้นการวิเคราะห์สารตั้งต้นความสุข!", delay: 3500 }
  ];

  simulationSteps.forEach(step => {
    setTimeout(() => {
      statusText.innerText = step.text;
      
      // Final step triggers completion UI
      if (step.text.startsWith("เสร็จสิ้น")) {
        // Change spinner to Checkmark
        spinner.className = "w-4 h-4 text-green-500 flex items-center justify-center";
        spinner.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        `;
        
        // Enable Next Button
        nextBtn.removeAttribute("disabled");
        nextBtn.className = "pill-btn-orange w-40 mx-auto py-2.5 rounded-full font-title font-medium text-sm transition";
      }
    }, step.delay);
  });
}

// Share function
// Share functions
const shareText = `ฉันได้เข้าร่วม "เปิดห้องทดลองความสุข" และได้แชร์เรื่องราวความสุขเชื่อมโยงกับน้องๆ ยุวพัฒน์ มาร่วมแบ่งปันความสุขและช่วยเหลือการศึกษากับมูลนิธิยุวพัฒน์และเทใจด้วยกันนะ 🧡`;
const shareUrl = "https://ybf-happiness-lab.vercel.app";

// 1. Copy link to clipboard
function copyShareLink() {
  const dummyInput = document.createElement("textarea");
  document.body.appendChild(dummyInput);
  dummyInput.value = `${shareText}\n\nร่วมกิจกรรมได้ที่: ${shareUrl}`;
  dummyInput.select();
  document.execCommand("copy");
  document.body.removeChild(dummyInput);
  
  alert("คัดลอกข้อความและลิงก์สำหรับแชร์ไปยังคลิปบอร์ดเรียบร้อยแล้วค่ะ 🧡");
}

// 2. Share on Facebook
function shareFacebook() {
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  window.open(fbUrl, '_blank', 'width=600,height=400');
}

// 3. Share on LINE
function shareLine() {
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  window.open(lineUrl, '_blank', 'width=600,height=500');
}

// Reset Game / Replay
function resetLab() {
  // Clear inputs
  document.getElementById("input-happiness").value = "";
  document.getElementById("char-counter").innerText = "0";
  
  // Clear selection state
  gameState.selectedCard = null;
  gameState.matchedCards = [];

  // Disable button again
  const happinessBtn = document.getElementById("btn-happiness-submit");
  happinessBtn.setAttribute("disabled", "true");
  happinessBtn.className = "w-40 mx-auto py-2.5 bg-warm-800/10 text-warm-800/30 cursor-not-allowed font-title font-medium text-sm rounded-full transition duration-300";

  goToScreen(3);
}

// 4. Export Card Pair as a 1080x1350 Image
function exportCardAsImage() {
  const card = gameState.selectedCard;
  if (!card) {
    alert("ยังไม่ได้เลือกการ์ดของน้องค่ะ ไม่สามารถดาวน์โหลดภาพได้");
    return;
  }

  // Show loading indicator
  const exportBtn = document.querySelector("button[title*='ดาวน์โหลดรูปภาพ']");
  const originalHtml = exportBtn.innerHTML;
  exportBtn.innerHTML = `
    <svg class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
  `;
  exportBtn.setAttribute("disabled", "true");

  // Populate hidden export elements
  document.querySelector("#export-container .export-user-name").innerText = gameState.userProfile.name || "คุณ";
  document.querySelector("#export-container .export-user-story").innerText = gameState.userHappinessText || "";
  
  document.getElementById("export-kid-name").innerText = card.owner || "";
  document.getElementById("export-kid-title").innerText = card.title || "";
  document.getElementById("export-kid-reason").innerText = card.reason || "";
  
  const exportImg = document.getElementById("export-kid-image");
  exportImg.src = card.image;

  // Let DOM update and trigger html2canvas
  setTimeout(() => {
    const container = document.getElementById("export-container");
    
    html2canvas(container, {
      scale: 2, // High resolution scale
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#FCFBF7"
    }).then(canvas => {
      const link = document.createElement("a");
      link.download = `happiness_card_${card.owner}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      exportBtn.innerHTML = originalHtml;
      exportBtn.removeAttribute("disabled");
    }).catch(err => {
      console.error("Export failed:", err);
      alert("ดาวน์โหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้งค่ะ");
      exportBtn.innerHTML = originalHtml;
      exportBtn.removeAttribute("disabled");
    });
  }, 300);
}
