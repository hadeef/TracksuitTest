import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps;

export const AddInsight = (props: AddInsightProps) => {
  const addInsight = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const brandId = Number((form.elements[0] as HTMLSelectElement).value);
    const text = (form.elements[1] as HTMLTextAreaElement).value;

    // Make a POST request to your backend route
    const res = await fetch("/insights/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId, text }),
    });

    if (res.ok) {
      if (props.onClose) props.onClose();
      globalThis.location.reload();
    } else {
      // Try to parse the error message from the backend
      let errorMsg = "Failed to add insight";
      try {
        const data = await res.json();
        if (data && data.error) errorMsg = data.error;
      } catch {
        // Ignore JSON parse errors
      }
      alert(errorMsg);
    }

    // Optionally close modal or reset form here
    if (props.onClose) props.onClose();
  };

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
        <label className={styles.field}>
          <select className={styles["field-input"]}>
            {BRANDS.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
          />
        </label>
        <Button className={styles.submit} type="submit" label="Add insight" />
      </form>
    </Modal>
  );
};
