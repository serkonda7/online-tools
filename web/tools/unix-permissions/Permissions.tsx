import { For, createMemo, createSignal } from 'solid-js';
import type { ToolContext } from '../../app/types';
import { CopyButton } from '../../ui/CopyButton';
import {
  DEFAULT_MODE,
  type Mode,
  PERMISSIONS,
  PERMISSION_SYMBOL,
  ROLES,
  type Role,
  has,
  parseOctal,
  parseSymbolic,
  toOctal,
  toSymbolic,
  withPermission,
} from './permissions';

const ROLE_LABEL: Record<Role, string> = { user: 'user', group: 'group', other: 'others' };

export function Permissions(props: { ctx: ToolContext }) {
  // One source of truth. Octal, symbolic and every checkbox derive from it,
  // which is what used to be four functions calling each other.
  const [mode, setMode] = createSignal<Mode>(
    parseOctal(props.ctx.params().get('mode') ?? '') ?? DEFAULT_MODE,
  );
  const octal = createMemo(() => toOctal(mode()));
  const symbolic = createMemo(() => toSymbolic(mode()));

  let octalInput!: HTMLInputElement;
  let symbolicInput!: HTMLInputElement;

  function apply(next: Mode) {
    setMode(next);
    // Shareable URL: /unix-permissions?mode=755
    props.ctx.setParams({ mode: toOctal(next) });
    octalInput.setCustomValidity('');
    symbolicInput.setCustomValidity('');
  }

  return (
    <div class="shell">
      <header class="intro">
        <h1>Permissions calculator</h1>
      </header>

      <section class="result" aria-label="Permission result">
        <div class="octal-wrap">
          <label class="result-label" for="octal">
            octal
          </label>
          <div class="value-actions">
            <input
              id="octal"
              class="octal value-input"
              ref={octalInput}
              value={octal()}
              inputmode="numeric"
              maxlength="3"
              aria-label="Octal mode"
              spellcheck={false}
              autocomplete="off"
              onInput={(event) => {
                const parsed = parseOctal(event.currentTarget.value);
                event.currentTarget.setCustomValidity(
                  parsed === null ? 'Enter three octal digits from 0 to 7.' : '',
                );
                if (parsed !== null) apply(parsed);
              }}
            />
            <CopyButton
              ctx={props.ctx}
              value={octal()}
              label="octal mode"
              onFailed={() => octalInput.select()}
            />
          </div>
        </div>

        <div class="value-wrap">
          <label class="result-label" for="symbolic">
            mode
          </label>
          <div class="value-actions">
            <input
              id="symbolic"
              class="symbolic value-input"
              ref={symbolicInput}
              value={symbolic()}
              aria-label="Symbolic mode"
              spellcheck={false}
              autocomplete="off"
              onInput={(event) => {
                const parsed = parseSymbolic(event.currentTarget.value);
                event.currentTarget.setCustomValidity(
                  parsed === null ? 'Use -rwxrwxrwx or rwxrwxrwx format.' : '',
                );
                if (parsed !== null) apply(parsed);
              }}
            />
            <CopyButton
              ctx={props.ctx}
              value={symbolic()}
              label="symbolic mode"
              onFailed={() => symbolicInput.select()}
            />
          </div>
        </div>
      </section>

      <section class="permissions" aria-label="Choose permissions">
        <div class="permission-row permission-heading" aria-hidden="true">
          <span />
          <For each={PERMISSIONS}>{(permission) => <span>{permission}</span>}</For>
        </div>

        <For each={ROLES}>
          {(role) => (
            <div class="permission-row">
              <h2>{ROLE_LABEL[role]}</h2>
              <For each={PERMISSIONS}>
                {(permission) => (
                  <label>
                    <input
                      type="checkbox"
                      checked={has(mode(), role, permission)}
                      onChange={(event) =>
                        apply(withPermission(mode(), role, permission, event.currentTarget.checked))
                      }
                    />
                    <span>{PERMISSION_SYMBOL[permission]}</span>
                    <b class="sr-only">
                      {ROLE_LABEL[role]} {permission}
                    </b>
                  </label>
                )}
              </For>
            </div>
          )}
        </For>
      </section>

      <footer>
        <button class="reset" type="button" onClick={() => apply(DEFAULT_MODE)}>
          Reset
        </button>
      </footer>
    </div>
  );
}
