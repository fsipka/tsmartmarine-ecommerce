"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PHONE_COUNTRIES, PhoneCountry, findPhoneCountry } from "@/constants/phone-countries";

interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (full: string) => void;
  disabled?: boolean;
  required?: boolean;
  defaultCountryId?: string;
  placeholder?: string;
  /** Renders inline error helper text. */
  showValidation?: boolean;
}

/**
 * Country-code + national number input.
 *
 * Emits the combined value as `${phoneCode} ${digits}` (e.g. `+90 5551234567`)
 * on every change, mirroring the panel's PhoneNumberInput contract. Empty
 * input emits an empty string.
 */
const PhoneInput: React.FC<PhoneInputProps> = ({
  label = "Phone",
  value,
  onChange,
  disabled = false,
  required = false,
  defaultCountryId = "TR",
  placeholder,
  showValidation = true,
}) => {
  const [country, setCountry] = useState<PhoneCountry>(
    () => findPhoneCountry(defaultCountryId) || PHONE_COUNTRIES[0]
  );
  const [digits, setDigits] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  // Parse incoming `value` once per change.
  useEffect(() => {
    if (!value) {
      setDigits("");
      return;
    }
    // Match the leading phone code (longest first to avoid +1 swallowing +1-XXX)
    const sorted = [...PHONE_COUNTRIES].sort(
      (a, b) => b.phoneCode.length - a.phoneCode.length
    );
    const match = sorted.find((c) => value.replace(/\s/g, "").startsWith(c.phoneCode));
    if (match) {
      setCountry(match);
      const rest = value.replace(/\s/g, "").slice(match.phoneCode.length);
      setDigits(rest.replace(/\D/g, ""));
    } else {
      setDigits(value.replace(/\D/g, ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Close dropdown on outside click.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return PHONE_COUNTRIES;
    return PHONE_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phoneCode.includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }, [search]);

  const emit = (next: PhoneCountry, nextDigits: string) => {
    if (!nextDigits) {
      onChange("");
    } else {
      onChange(`${next.phoneCode} ${nextDigits}`);
    }
  };

  const handleCountrySelect = (c: PhoneCountry) => {
    setCountry(c);
    setOpen(false);
    setSearch("");
    emit(c, digits);
  };

  const handleDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, country.maxLength);
    setDigits(cleaned);
    emit(country, cleaned);
  };

  const isValid = !digits || country.pattern.test(digits);

  return (
    <div className="w-full" ref={wrapRef}>
      {label && (
        <label className="block text-sm font-medium text-dark mb-2">
          {label} {required && <span className="text-red">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        {/* Country selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setOpen((v) => !v)}
            disabled={disabled}
            className={`flex items-center gap-2 px-3 py-3 border rounded-md min-w-[110px] bg-white text-sm focus:outline-none focus:border-blue ${
              isValid ? "border-gray-3" : "border-red"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <span className="font-mono">{country.phoneCode}</span>
            <span className="text-xs text-dark-5 truncate max-w-[60px]">{country.id}</span>
            <i className="ml-auto text-xs">▾</i>
          </button>

          {open && (
            <div className="absolute z-20 mt-1 w-72 max-h-72 overflow-auto bg-white border border-gray-3 rounded-md shadow-lg">
              <div className="sticky top-0 bg-white p-2 border-b border-gray-3">
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="w-full px-3 py-2 text-sm border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                />
              </div>
              {filtered.length === 0 ? (
                <div className="px-3 py-3 text-sm text-dark-5 text-center">No country.</div>
              ) : (
                <ul>
                  {filtered.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => handleCountrySelect(c)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-1 flex gap-2 items-center ${
                          c.id === country.id ? "bg-gray-2 font-semibold" : ""
                        }`}
                      >
                        <span className="font-mono w-14 shrink-0">{c.phoneCode}</span>
                        <span className="text-xs text-dark-5 w-8 shrink-0">{c.id}</span>
                        <span className="truncate">{c.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Digits input */}
        <input
          type="tel"
          inputMode="tel"
          value={digits}
          onChange={handleDigitsChange}
          disabled={disabled}
          placeholder={placeholder || `Enter ${country.name} phone number`}
          maxLength={country.maxLength}
          className={`flex-1 px-4 py-3 border rounded-md focus:outline-none focus:border-blue ${
            isValid ? "border-gray-3" : "border-red"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        />
      </div>

      {showValidation && (
        <div className="mt-1 px-1 text-xs text-dark-5 flex justify-between">
          <span>
            {country.name} {country.phoneCode}
          </span>
          <span className={!isValid ? "text-red" : ""}>
            {digits.length}/{country.maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;