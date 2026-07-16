const fs = require('fs');
let code = fs.readFileSync('src/components/screens/InboxScreen.tsx', 'utf8');

code = code.replace(
  "  markMessageAsRead: (id: string) => void;\n}",
  "  markMessageAsRead: (id: string) => void;\n  handleCloseMessage?: () => void;\n}"
);

code = code.replace(
  "  markMessageAsRead\n}) => {",
  "  markMessageAsRead,\n  handleCloseMessage\n}) => {"
);

code = code.replaceAll(
  "onClick={() => setSelectedMessageId(null)}",
  "onClick={() => handleCloseMessage ? handleCloseMessage() : setSelectedMessageId(null)}"
);

code = code.replaceAll(
  "onClick={() => {\n                    setSelectedMessageId(null);\n                    setHasAcceptedMission(true);\n                  }}",
  "onClick={() => {\n                    handleCloseMessage ? handleCloseMessage() : setSelectedMessageId(null);\n                    setHasAcceptedMission(true);\n                  }}"
);

fs.writeFileSync('src/components/screens/InboxScreen.tsx', code);
