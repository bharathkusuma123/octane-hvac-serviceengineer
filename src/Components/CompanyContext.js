// contexts/CompanyContext.js
import { createContext, useContext, useState } from 'react';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState(
    localStorage.getItem("selectedCompany") || ""
  );

  const updateCompany = (company) => {
    setSelectedCompany(company);
    localStorage.setItem("selectedCompany", company);
  };

  return (
    <CompanyContext.Provider value={{ selectedCompany, updateCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);