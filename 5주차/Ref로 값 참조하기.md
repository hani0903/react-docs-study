# Ref로 값 참조하기

컴포넌트 내부에서 화면에 표시하진 않을 거지만 저장해둬야 하는 값이 있다면 `useRef`를 사용한다.

## Ref란?

-   `useRef`는 **렌더링과 관련 없는 데이터를 저장**하기 위한 Hook이다.
-   React의 state와 달리 **값을 변경해도 리렌더링을 발생시키지 않는다**.
-   내부적으로 `{current: value}` 형태의 객체를 반환하며, 원하는 값을 저장할 수 있다.

```jsx
import { useRef } from 'react';

const ref = useRef(0); // { current: 0 } 객체 반환
```

## Ref의 기본 사용법

```jsx
function Counter() {
    const ref = useRef(0);

    const handleClick = () => {
        ref.current += 1;
        alert(`You clicked ${ref.current} times!`);
    };

    return <button onClick={handleClick}>Click me</button>;
}
```

-   `ref.current`는 읽고 쓸 수 있는 값이다.

## State와 Ref의 차이

| 항목                 | Ref (`useRef`)                                               | State (`useState`)                                                     |
| -------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 선언 방식            | `useRef(initialValue)` → `{ current: initialValue }` 반환    | `useState(initialValue)` → `[value, setValue]` 형태로 반환             |
| 값 변경 시 렌더링    | ❌ 값 변경해도 리렌더링되지 않음                             | ⭕ 값 변경 시 리렌더링 발생                                            |
| 값 접근 가능 시점    | 렌더링 이후 (렌더링 중에는 읽기/쓰기 피해야 함)              | 렌더링 중에도 언제든 접근 가능. 단, 각 렌더링마다 고정된 snapshot 사용 |
| 값 변경 방법         | `ref.current = newValue`로 직접 변경 (mutable)               | `setValue(newValue)`로 변경 (immutable + queue에 등록됨)               |
| 사용 목적            | DOM 요소 접근, 렌더링 없이 값 유지, 타이머/외부 변수 참조 등 | 렌더링이 필요한 UI 상태 관리용                                         |
| React 흐름 관여 여부 | ❌ React가 추적하지 않음 (렌더링 트리거 X)                   | ⭕ React가 추적하고 리렌더링을 자동으로 트리거함                       |

## 언제 Ref를 사용할까?🤔

-   렌더링과 무관한 값을 저장하고 싶을 때
-   `setTimeout`, `setInterval` 등의 ID값 저장
-   `<input />` 등의 DOM 엘리먼트 접근이 필요할 때
-   JSX 계산과 무관한 외부 객체 저장 (예: socket, Web API 등)

### 예제

```jsx
const timeoutRef = useRef(null);

function handleStart() {
    timeoutRef.current = setTimeout(() => {
        alert('Time is up!');
    }, 3000);
}

function handleStop() {
    clearTimeout(timeoutRef.current);
}
```

## Ref 사용시 주의사항

-   Ref는 렌더링 간 정보를 유지하는 데 적합
-   ❌ Ref 값을 render() 중 직접 읽거나 쓰면 의도하지 않은 동작이 발생할 수 있음
    -   렌더링에는 관여하지 않기 때문에, 읽은 값이 안 맞거나 오래된 값일 수 있음!
-   ⭕ ref.current를 렌더링 중 최초 1회 설정하는 용도는 예외로 허용됨
