import type { Message as MessageType } from "../../../types/Message";
import { dateOrStringToDate } from "../../../utils/dateCalculator";
import getProfilePictureUrl from "../../../utils/pictureProfileManager";

type MessageProps = {
  regroupement: MessageType[];
  userId: number;
};

function heurMintute(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function defClassRadius(nbMessage: number, messageNumero: number, isAutreMessage: boolean): string {
  // si c'est le dernier message, on arrondi en bas
  if (messageNumero === nbMessage)
    return `rounded-t-[16px] ${isAutreMessage ? "rounded-bl-[16px]" : "rounded-br-[16px]"}`;

  // sinon, on n'arrondi pas
  return "rounded-[16px]";
}

function defClassColor(isAutreMessage: boolean): string {
  return isAutreMessage ? "bg-[#CECFEB] border-[#A9ABE8]" : "bg-[#E6E6E6] border-[#DCDCDC]";
}

export default function Message({ regroupement, userId }: MessageProps) {
  const isAutreMessage = Number(regroupement[0].user.id) === userId;

  return (
    // contenaure group
    <div
      className={`w-full flex gap-[10px] items-end justify-end ${isAutreMessage ? "" : "flex-row-reverse"}`}
    >
      <div>
        {/* nom */}
        {!isAutreMessage && (
          <p className="capitalize text-[#4B5563] ml-[16px] mb-[2px]">
            {regroupement[0].user.firstName}&nbsp;
            <span className="uppercase">{regroupement[0].user.lastName.at(0)}.</span>
          </p>
        )}

        <div className={`flex ${isAutreMessage ? "" : "flex-row-reverse"}`}>
          {/* texte */}
          <div className="flex flex-col gap-[10px]">
            {regroupement.map((message, index) => {
              return (
                <div
                  className={`w-[320px] border-[1px] px-[16px] py-[10px] ${defClassRadius(regroupement.length, index + 1, isAutreMessage)} ${defClassColor(isAutreMessage)}`}
                  key={message.id}
                >
                  <p className="text-[16px] leading-[1.25]">{message.content}</p>
                  <p className="text-end text-[#4B5563] text-[14px]">
                    {heurMintute(dateOrStringToDate(message.createdAt))}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* pp */}
      <div>
        <img
          src={getProfilePictureUrl(regroupement[0].user.image_url)}
          alt="profile utilisateur"
          className="w-[60px] h-[60px] rounded-full"
        />
      </div>
    </div>
  );
}
