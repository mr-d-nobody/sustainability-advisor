export default function Recharge() {
  return (
    <div className="p-6 md:ml-64 pt-6 text-white">

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 
      p-6 rounded-2xl shadow-xl max-w-lg">

        <h2 className="text-xl font-semibold mb-4">
          💳 Recharge Credits
        </h2>

        <p className="text-green-200 text-sm leading-relaxed">
          Your account currently has no available credits.
          <br /><br />
          To continue using AI sustainability advice,
          please contact the owner to recharge your credits.
        </p>

      </div>

    </div>
  );
}