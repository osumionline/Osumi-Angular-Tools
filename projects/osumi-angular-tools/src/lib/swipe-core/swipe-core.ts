import { fromEvent, Observable, race, Subscription } from 'rxjs';
import { elementAt, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  SwipeCoordinates,
  SwipeDirection,
  SwipeEvent,
  SwipeStartEvent,
  SwipeSubscriptionConfig,
} from '../interfaces/swipe.interface';

export function createSwipeSubscription({
  domElement,
  onSwipeMove,
  onSwipeEnd,
}: SwipeSubscriptionConfig): Subscription {
  if (!(domElement instanceof HTMLElement)) {
    throw new Error('Provided domElement should be an instance of HTMLElement');
  }

  if (typeof onSwipeMove !== 'function' && typeof onSwipeEnd !== 'function') {
    throw new Error(
      'At least one of the following swipe event handler functions should be provided: onSwipeMove and/or onSwipeEnd'
    );
  }

  const touchStarts$: Observable<SwipeCoordinates> = fromEvent<TouchEvent>(
    domElement,
    'touchstart'
  ).pipe(map(getTouchCoordinates));
  const touchMoves$: Observable<SwipeCoordinates> = fromEvent<TouchEvent>(
    domElement,
    'touchmove'
  ).pipe(map(getTouchCoordinates));
  const touchEnds$: Observable<SwipeCoordinates> = fromEvent<TouchEvent>(
    domElement,
    'touchend'
  ).pipe(map(getTouchCoordinates));
  const touchCancels$: Observable<TouchEvent> = fromEvent<TouchEvent>(
    domElement,
    'touchcancel'
  );

  const touchStartsWithDirection$: Observable<SwipeStartEvent> =
    touchStarts$.pipe(
      switchMap(
        (touchStartEvent: SwipeCoordinates): Observable<SwipeStartEvent> =>
          touchMoves$.pipe(
            elementAt(3),
            map(
              (touchMoveEvent: SwipeCoordinates): SwipeStartEvent => ({
                x: touchStartEvent.x,
                y: touchStartEvent.y,
                direction: getTouchDirection(touchStartEvent, touchMoveEvent),
              })
            )
          )
      )
    );

  return touchStartsWithDirection$
    .pipe(
      switchMap(
        (touchStartEvent: SwipeStartEvent): Observable<SwipeCoordinates> =>
          touchMoves$.pipe(
            map(
              (touchMoveEvent: SwipeCoordinates): SwipeCoordinates =>
                getTouchDistance(touchStartEvent, touchMoveEvent)
            ),
            tap((coordinates: SwipeCoordinates): void => {
              if (typeof onSwipeMove !== 'function') {
                return;
              }
              onSwipeMove(getSwipeEvent(touchStartEvent, coordinates));
            }),
            takeUntil(
              race(
                touchEnds$.pipe(
                  map(
                    (touchEndEvent: SwipeCoordinates): SwipeCoordinates =>
                      getTouchDistance(touchStartEvent, touchEndEvent)
                  ),
                  tap((coordinates: SwipeCoordinates): void => {
                    if (typeof onSwipeEnd !== 'function') {
                      return;
                    }
                    onSwipeEnd(getSwipeEvent(touchStartEvent, coordinates));
                  })
                ),
                touchCancels$
              )
            )
          )
      )
    )
    .subscribe();
}

function getTouchCoordinates(touchEvent: TouchEvent): SwipeCoordinates {
  return {
    x: touchEvent.changedTouches[0].clientX,
    y: touchEvent.changedTouches[0].clientY,
  };
}

function getTouchDistance(
  startCoordinates: SwipeCoordinates,
  moveCoordinates: SwipeCoordinates
): SwipeCoordinates {
  return {
    x: moveCoordinates.x - startCoordinates.x,
    y: moveCoordinates.y - startCoordinates.y,
  };
}

function getTouchDirection(
  startCoordinates: SwipeCoordinates,
  moveCoordinates: SwipeCoordinates
): SwipeDirection {
  const { x, y } = getTouchDistance(startCoordinates, moveCoordinates);
  return Math.abs(x) < Math.abs(y) ? SwipeDirection.Y : SwipeDirection.X;
}

function getSwipeEvent(
  touchStartEvent: SwipeStartEvent,
  coordinates: SwipeCoordinates
): SwipeEvent {
  return {
    direction: touchStartEvent.direction,
    distance: coordinates[touchStartEvent.direction],
  };
}