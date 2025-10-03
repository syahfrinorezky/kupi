import clsx from "clsx";

const getPasswordStrength = (password: string) => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return strength;
};

export const PasswordStrengthBar = ({ password }: { password: string }) => {
  const strength = getPasswordStrength(password);

  const labels = ["Lemah", "Sedang", "Kuat", "Sangat Kuat"];
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  return (
    <div className="mt-1">
      <p className="text-xs text-gray-500 mb-1">
        {strength > 0 ? `${labels[strength - 1]}` : "Belum ada password"}
      </p>
      <div className="flex gap-x-1">
        {[0, 1, 2, 3].map((level) => (
          <div
            key={level}
            className={clsx(
              "h-2 flex-1 rounded transition-colors duration-300 ease-in-out",
              level < strength ? colors[strength - 1] : "bg-gray-300"
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};
