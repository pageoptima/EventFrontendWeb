import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  useMyProfile,
  useUpdateProfile,
  useUpdateAddress,
  useUpdateSettings,
  useUpdateEmail,
  useUpdatePhone,
} from "@/features/profile/hooks/useProfile";
import { VALIDATION } from "@/shared/utils/constants";
import { EMAIL_REGEX, USERNAME_REGEX, PHONE_REGEX } from "@/shared/utils/regex";
import { getApiErrorMessage } from "@/shared/utils/errors";

// ─── Constants ────────────────────────────────────────────────────────────────

const GENDER_OPTIONS = [
  { value: "", label: "— Not specified —" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "NON_BINARY", label: "Non-binary" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

const NOTIFICATION_OPTIONS = [
  { value: "ALLOW", label: "Allow all" },
  { value: "MUTE_2_HOURS", label: "Mute for 2 hours" },
  { value: "MUTE_8_HOURS", label: "Mute for 8 hours" },
  { value: "MUTE_FOREVER", label: "Mute forever" },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

// isSelect=true uses bg-card + color-scheme so native dropdown options are readable in dark mode
function inputCls(error, isSelect = false) {
  return [
    "w-full rounded-lg border px-3 py-2.5 text-sm text-foreground transition",
    isSelect
      ? "bg-card dark:[color-scheme:dark] cursor-pointer"
      : "bg-transparent placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-[#B839F1]/40 dark:focus:ring-[#7F5AF0]/40",
    error
      ? "border-destructive"
      : "border-border hover:border-[#B839F1]/50 dark:hover:border-[#7F5AF0]/50",
  ].join(" ");
}

function Field({ label, id, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SaveRow({ isPending, saved, apiError }) {
  return (
    <div className="space-y-1.5">
      {apiError && <p className="text-xs text-destructive">{apiError}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-gradient-h px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Saving…" : "Save"}
        </button>
        {saved && !isPending && (
          <span className="text-xs font-medium text-green-600 dark:text-green-400">Saved!</span>
        )}
      </div>
    </div>
  );
}

// ─── Profile info form ────────────────────────────────────────────────────────

function EditProfileForm({ profile }) {
  const [fields, setFields] = useState({
    name: profile.name ?? "",
    username: profile.username ?? "",
    bio: profile.bio ?? "",
    gender: profile.gender ?? "",
    dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "",
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const mutation = useUpdateProfile();

  const handleChange = ({ target: { name, value } }) => {
    setFields((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (mutation.isError) mutation.reset();
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    const name = fields.name.trim();
    const username = fields.username.trim();
    const bio = fields.bio.trim();

    if (name.length < VALIDATION.NAME_MIN || name.length > VALIDATION.PROFILE_NAME_MAX) {
      errs.name = `Name must be ${VALIDATION.NAME_MIN}–${VALIDATION.PROFILE_NAME_MAX} characters.`;
    }
    if (
      username &&
      (username.length < VALIDATION.PROFILE_USERNAME_MIN ||
        username.length > VALIDATION.PROFILE_USERNAME_MAX ||
        !USERNAME_REGEX.test(username))
    ) {
      errs.username = `${VALIDATION.PROFILE_USERNAME_MIN}–${VALIDATION.PROFILE_USERNAME_MAX} chars: lowercase, numbers, dots, underscores only.`;
    }
    if (bio.length > VALIDATION.BIO_MAX) {
      errs.bio = `Bio must be at most ${VALIDATION.BIO_MAX} characters.`;
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {};
    if (name) payload.name = name;
    if (username) payload.username = username;
    if (bio) payload.bio = bio;
    if (fields.gender) payload.gender = fields.gender;
    if (fields.dateOfBirth) payload.dateOfBirth = fields.dateOfBirth;

    mutation.mutate(payload, { onSuccess: () => setSaved(true) });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Personal Info
      </p>

      <Field label="Full name" id="pf-name" error={errors.name}>
        <input
          id="pf-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          value={fields.name}
          onChange={handleChange}
          className={inputCls(errors.name)}
        />
      </Field>

      <Field
        label="Username"
        id="pf-username"
        error={errors.username}
        hint="Lowercase letters, numbers, dots, underscores. 3–30 characters."
      >
        <input
          id="pf-username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="janedoe"
          value={fields.username}
          onChange={handleChange}
          className={inputCls(errors.username)}
        />
      </Field>

      <Field label="Bio" id="pf-bio" error={errors.bio}>
        <textarea
          id="pf-bio"
          name="bio"
          rows={3}
          placeholder="Tell others a little about yourself…"
          value={fields.bio}
          onChange={handleChange}
          className={[inputCls(errors.bio), "resize-none"].join(" ")}
        />
        <p className="text-xs text-muted-foreground text-right">
          {fields.bio.length}/{VALIDATION.BIO_MAX}
        </p>
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Gender" id="pf-gender" error={errors.gender}>
          <select
            id="pf-gender"
            name="gender"
            value={fields.gender}
            onChange={handleChange}
            className={inputCls(errors.gender, true)}
          >
            {GENDER_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </Field>

        <Field label="Date of birth" id="pf-dob" error={errors.dateOfBirth}>
          <input
            id="pf-dob"
            name="dateOfBirth"
            type="date"
            value={fields.dateOfBirth}
            onChange={handleChange}
            className={inputCls(errors.dateOfBirth)}
          />
        </Field>
      </div>

      <SaveRow
        isPending={mutation.isPending}
        saved={saved}
        apiError={mutation.isError ? getApiErrorMessage(mutation.error) : ""}
      />
    </form>
  );
}

// ─── Address form ─────────────────────────────────────────────────────────────

function EditAddressForm({ profile }) {
  const addr = profile.address ?? {};
  const [fields, setFields] = useState({
    addressLine: addr.addressLine ?? "",
    city: addr.city ?? "",
    state: addr.state ?? "",
    country: addr.country ?? "",
    postalCode: addr.postalCode ?? "",
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const mutation = useUpdateAddress();

  const handleChange = ({ target: { name, value } }) => {
    setFields((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (mutation.isError) mutation.reset();
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const addressLine = fields.addressLine.trim();
    if (!addressLine) {
      setErrors({ addressLine: "Address line is required." });
      return;
    }
    if (addressLine.length > VALIDATION.ADDRESS_LINE_MAX) {
      setErrors({ addressLine: `Address line must be at most ${VALIDATION.ADDRESS_LINE_MAX} characters.` });
      return;
    }

    const payload = { addressLine };
    if (fields.city.trim()) payload.city = fields.city.trim();
    if (fields.state.trim()) payload.state = fields.state.trim();
    if (fields.country.trim()) payload.country = fields.country.trim();
    if (fields.postalCode.trim()) payload.postalCode = fields.postalCode.trim();

    mutation.mutate(payload, { onSuccess: () => setSaved(true) });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Address
      </p>

      <Field label="Address line" id="addr-line" error={errors.addressLine}>
        <input
          id="addr-line"
          name="addressLine"
          type="text"
          placeholder="123 Main Street"
          value={fields.addressLine}
          onChange={handleChange}
          className={inputCls(errors.addressLine)}
        />
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="City" id="addr-city" error={errors.city}>
          <input
            id="addr-city"
            name="city"
            type="text"
            placeholder="New York"
            value={fields.city}
            onChange={handleChange}
            className={inputCls(errors.city)}
          />
        </Field>
        <Field label="State / Region" id="addr-state" error={errors.state}>
          <input
            id="addr-state"
            name="state"
            type="text"
            placeholder="NY"
            value={fields.state}
            onChange={handleChange}
            className={inputCls(errors.state)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Country" id="addr-country" error={errors.country}>
          <input
            id="addr-country"
            name="country"
            type="text"
            placeholder="United States"
            value={fields.country}
            onChange={handleChange}
            className={inputCls(errors.country)}
          />
        </Field>
        <Field label="Postal code" id="addr-postal" error={errors.postalCode}>
          <input
            id="addr-postal"
            name="postalCode"
            type="text"
            placeholder="10001"
            value={fields.postalCode}
            onChange={handleChange}
            className={inputCls(errors.postalCode)}
          />
        </Field>
      </div>

      <SaveRow
        isPending={mutation.isPending}
        saved={saved}
        apiError={mutation.isError ? getApiErrorMessage(mutation.error) : ""}
      />
    </form>
  );
}

// ─── Contact form (email + phone) ─────────────────────────────────────────────

function EditContactForm({ profile }) {
  const [email, setEmail] = useState(profile.email ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [phoneSaved, setPhoneSaved] = useState(false);
  const emailMutation = useUpdateEmail();
  const phoneMutation = useUpdatePhone();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError("");
    emailMutation.mutate({ email: trimmed }, { onSuccess: () => setEmailSaved(true) });
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    const trimmed = phone.trim();
    if (!PHONE_REGEX.test(trimmed)) {
      setPhoneError("Use international format, e.g. +12125552368");
      return;
    }
    setPhoneError("");
    phoneMutation.mutate({ phone: trimmed }, { onSuccess: () => setPhoneSaved(true) });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Contact
      </p>

      <form onSubmit={handleEmailSubmit} className="space-y-3">
        <Field label="Email address" id="contact-email" error={emailError}>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
              setEmailSaved(false);
              if (emailMutation.isError) emailMutation.reset();
            }}
            className={inputCls(emailError)}
          />
        </Field>
        <SaveRow
          isPending={emailMutation.isPending}
          saved={emailSaved}
          apiError={emailMutation.isError ? getApiErrorMessage(emailMutation.error) : ""}
        />
      </form>

      <hr className="border-border" />

      <form onSubmit={handlePhoneSubmit} className="space-y-3">
        <Field
          label="Phone number"
          id="contact-phone"
          error={phoneError}
          hint="International format required (e.g. +12125552368)"
        >
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+12125552368"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setPhoneError("");
              setPhoneSaved(false);
              if (phoneMutation.isError) phoneMutation.reset();
            }}
            className={inputCls(phoneError)}
          />
        </Field>
        <SaveRow
          isPending={phoneMutation.isPending}
          saved={phoneSaved}
          apiError={phoneMutation.isError ? getApiErrorMessage(phoneMutation.error) : ""}
        />
      </form>
    </div>
  );
}

// ─── Notifications form ───────────────────────────────────────────────────────

function EditNotificationsForm({ profile }) {
  const [desktopNotification, setDesktopNotification] = useState(
    profile.settings?.desktopNotification ?? "ALLOW"
  );
  const [saved, setSaved] = useState(false);
  const mutation = useUpdateSettings();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ desktopNotification }, { onSuccess: () => setSaved(true) });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Notifications
      </p>

      <Field label="Desktop notifications" id="notif-desktop">
        <select
          id="notif-desktop"
          value={desktopNotification}
          onChange={(e) => {
            setDesktopNotification(e.target.value);
            setSaved(false);
            if (mutation.isError) mutation.reset();
          }}
          className={inputCls(undefined, true)}
        >
          {NOTIFICATION_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </Field>

      <SaveRow
        isPending={mutation.isPending}
        saved={saved}
        apiError={mutation.isError ? getApiErrorMessage(mutation.error) : ""}
      />
    </form>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

function EditProfilePanel() {
  const { data: profile, isLoading } = useMyProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Edit Profile</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Update your personal information.</p>
      </div>
      <EditProfileForm profile={profile} />
      <EditAddressForm profile={profile} />
      <EditContactForm profile={profile} />
      <EditNotificationsForm profile={profile} />
    </div>
  );
}

export default EditProfilePanel;
