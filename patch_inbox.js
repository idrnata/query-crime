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

const closeCode = `          onClick={() => {
            if (handleCloseMessage) handleCloseMessage();
            else setSelectedMessageId(null);
          }}`;

code = code.replace(
  /          onClick=\{\(\) => setSelectedMessageId\(null\)\}/g,
  closeCode
);

const closeCode2 = `                 onClick={() => {
                   if (handleCloseMessage) handleCloseMessage();
                   else setSelectedMessageId(null);
                 }}`;
code = code.replace(
  /                 onClick=\{\(\) => setSelectedMessageId\(null\)\}/g,
  closeCode2
);

const acceptCode = `                  onClick={() => {
                    if (handleCloseMessage) handleCloseMessage();
                    else setSelectedMessageId(null);
                    setHasAcceptedMission(true);
                  }}`;

code = code.replace(
  /                  onClick=\{\(\) => \{\n                    setSelectedMessageId\(null\);\n                    setHasAcceptedMission\(true\);\n                  \}\}/g,
  acceptCode
);

fs.writeFileSync('src/components/screens/InboxScreen.tsx', code);
