import MainLayout from "../components/Layouts/MainLayout.jsx";

const pageContent = {
  bill: {
    description:
      "Upcoming bills are integrated into the Overview page through the Upcoming Bill card.",
    title: "Bills",
  },
  goal: {
    description:
      "Goal progress is integrated into the Overview page through the Goals card.",
    title: "Goals",
  },
  setting: {
    description:
      "Theme accent and Light/Dark mode settings are available from the dashboard sidebar and header.",
    title: "Settings",
  },
  transaction: {
    description:
      "Recent transaction filtering is available on the Overview page through the Recent Transactions card.",
    title: "Transactions",
  },
};

function MenuPage({ type }) {
  const content = pageContent[type] ?? {
    description: "This section is available from the Finebank dashboard.",
    title: "Finebank",
  };

  return (
    <MainLayout>
      <section className="rounded bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Finebank Menu
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          {content.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          {content.description}
        </p>
      </section>
    </MainLayout>
  );
}

export default MenuPage;
